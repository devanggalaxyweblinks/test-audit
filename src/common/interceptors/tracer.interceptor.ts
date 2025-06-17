import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { context, trace } from '@opentelemetry/api';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = executionContext.switchToHttp();
    const request = httpContext.getRequest();

    // Retrieve the active OpenTelemetry context
    const activeContext = context.active();

    // Retrieve the current span from the active context
    const currentSpan = trace.getSpan(activeContext);

    // Optionally, add attributes to the current span (like HTTP method, URL, etc.)
    if (currentSpan) {
      currentSpan.setAttributes({
        'http.method': request.method,
        'http.url': request.url,
      });
    }

    // Continue the request and end the span when processing is complete
    return next.handle().pipe(
      tap(() => {
        if (currentSpan) {
          currentSpan.end(); // Mark the span as ended
        }
      }),
    );
  }
}
