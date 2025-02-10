import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

const authSecret = 'password123+';

// Look at this file only if asked by the interviewer
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        if (request.headers.authorization !== authSecret) {
          response.status(401);
        }

        return data;
      }),
    );
  }
}
