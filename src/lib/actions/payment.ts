/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { APIContracts, APIControllers } from 'authorizenet';
import { and, eq } from 'drizzle-orm';
import { type z } from 'zod';

import { env } from '~/env';
import { db } from '~/db';
import { orderProducts, orders, orderStatuses, productStocks } from '~/db/schema';
import { getUser } from '~/lib/auth';
import { paymentSchema } from '~/lib/validations/payment';

export async function payment(rawInput: z.infer<typeof paymentSchema>) {
  const { card, expiry, cvc, orderCode } = paymentSchema.parse(rawInput);
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const order = await db.query.orders.findFirst({
    where: and(eq(orders.code, orderCode), eq(orders.userId, user.id)),
    columns: {
      id: true,
      grandTotal: true,
      code: true,
    },
    with: {
      orderStatuses: {
        columns: {
          status: true,
        },
      },
    },
  });
  if (!order) {
    throw new Error('Order not found');
  }
  const alreadyPaid = order.orderStatuses.some(status => status.status === 'PAID');
  if (alreadyPaid) {
    throw new Error('Order already paid');
  }
  const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(env.AUTHORIZE_NET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(env.AUTHORIZE_NET_TRANSACTION_KEY);
  const creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(card);
  creditCard.setExpirationDate(expiry);
  creditCard.setCardCode(cvc);
  const paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);
  const transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(order.grandTotal);
  const createTransactionRequest = new APIContracts.CreateTransactionRequest();
  createTransactionRequest.setMerchantAuthentication(merchantAuthenticationType);
  createTransactionRequest.setTransactionRequest(transactionRequestType);
  const createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);
  const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
  if (env.NODE_ENV === 'production' && env.AUTHORIZE_NET_SANDBOX !== 'true') {
    ctrl.setEnvironment('PRODUCTION');
  }
  ctrl.execute(async () => {
    const apiResponse = ctrl.getResponse();
    const response = new APIContracts.CreateTransactionResponse(apiResponse);
    if (response != null) {
      if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log('Transaction Response Code: ', response.getTransactionResponse().getResponseCode());
          console.log(
            'Transaction Response Message: ',
            response.getTransactionResponse().getMessages().getMessage()[0].getCode()
          );
          console.log('Auth Code: ', response.getTransactionResponse().getAuthCode());
          console.log('Transaction ID: ', response.getTransactionResponse().getTransId());
          await db.insert(orderStatuses).values({
            status: 'PAID',
            orderId: order.id,
          });
          const products = await db.query.orderProducts.findMany({
            where: eq(orderProducts.orderId, order.id),
            columns: {
              quantity: true,
              productStockId: true,
            },
          });
          await Promise.all(
            products.map(async product => {
              const productStock = await db.query.productStocks.findFirst({
                where: eq(productStocks.id, product.productStockId),
                columns: {
                  quantity: true,
                },
              });
              await db
                .update(productStocks)
                .set({ quantity: (productStock?.quantity ?? 0) - (product.quantity ?? 0) })
                .where(eq(productStocks.id, product.productStockId));
            })
          );
          revalidatePath('/products/[productSlug]', 'page');
          revalidatePath(`dashboard/orders/${order.code}`);
          revalidatePath(`payment/${order.code}`);
          revalidateTag('cart-items');
          revalidateTag('orders');
        } else {
          console.log('Transaction Failed');
          if (response.getTransactionResponse().getErrors() != null) {
            console.log('Error Code: ', response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
            console.log('Error message: ', response.getTransactionResponse().getErrors().getError()[0].getErrorText());
          }
        }
      } else {
        console.log('Transaction Failed');
        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
          console.log('Error Code: ', response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
          console.log('Error message: ', response.getTransactionResponse().getErrors().getError()[0].getErrorText());
        } else {
          console.log('Error Code: ', response.getMessages().getMessage()[0].getCode());
          console.log('Error message: ', response.getMessages().getMessage()[0].getText());
        }
      }
    } else {
      console.log('Null Response.');
    }
  });
}
