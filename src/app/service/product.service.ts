import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { query } from '@angular/animations';
import { Observable,  } from 'rxjs';
import { ProductItem } from '../type/type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductList(): Observable<any> {
    return this.http.get(`https://609f3a91c512c20017dccf36.mockapi.io/api/v1/city`)
  }

  getProductItem(id: string): Observable<any> {
    return this.http.get(`https://609f3a91c512c20017dccf36.mockapi.io/api/v1/city/${id}`)
  }

  updateProductItem(body: ProductItem) {
    return this.http.put(`https://609f3a91c512c20017dccf36.mockapi.io/api/v1/city/${body.id}`, body)
  }
}
