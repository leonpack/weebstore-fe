import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private myCategoryUrl = 'http://localhost:8080/api/product-category';

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    //TODO: need to build URL based on category id ... will come back to this!
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.GetProducts(searchUrl);
  }

  searchProduct(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`

    return this.GetProducts(searchUrl);
  }

  private GetProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.myCategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProduct(theProductId: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/${theProductId}`

    return this.httpClient.get<Product>(searchUrl)
  }

  getProductListPagination(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProduct>(searchUrl)
  }

  searchProductPagination(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProduct>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+`&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }


}

interface GetResponseProduct{
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}
