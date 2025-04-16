import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const youtubeApiInterceptor: HttpInterceptorFn = (req, next) => {
  const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
  const API_KEY = environment.youtubeApiKey;

  if (req.url.startsWith('@youtube')) {
    const path = req.url.substring(9);

    const apiUrl = `${API_BASE_URL}/${path}${
      path.includes('?') ? '&' : '?'
    }key=${API_KEY}`;

    const modifiedRequest = req.clone({
      url: apiUrl,
    });

    return next(modifiedRequest);
  }

  return next(req);
};
