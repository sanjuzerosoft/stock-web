import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { ContentApiResponse, ContentInfo } from '../models/content-info.model';
import { HOME_SECTION_IDS, HomeSectionKey } from '../models/content-ids';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://dynstocks.com/restapi/webservices/viewcontent/';

  getContent(id: number): Observable<ContentInfo> {
    return this.http.get<ContentApiResponse>(this.baseUrl, { params: { id } }).pipe(
      map((response) => {
        if (response.status === 'success' && response.data?.length) {
          return response.data[0];
        }
        throw new Error('Content not available');
      }),
    );
  }

  getHomeSections(): Observable<Record<HomeSectionKey, ContentInfo>> {
    return forkJoin({
      hero: this.getContent(HOME_SECTION_IDS.hero),
      strategies: this.getContent(HOME_SECTION_IDS.strategies),
      features: this.getContent(HOME_SECTION_IDS.features),
      build: this.getContent(HOME_SECTION_IDS.build),
      chatter: this.getContent(HOME_SECTION_IDS.chatter),
      gallery: this.getContent(HOME_SECTION_IDS.gallery),
      pricing: this.getContent(HOME_SECTION_IDS.pricing),
    });
  }
}
