import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Books';
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1
  thePageSize: number = 10
  theTotalElements: number = 0


  constructor(public productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
      });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //search for product using that 'keyword'
    this.productService.searchProduct(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )

  }

  handleListProducts(){
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the "id" param string. convert string to number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      //not category id available ... default to category id 1
      this.currentCategoryId = 1
      this.currentCategoryName = "Books"
    }

    //check if we have a different category than previous
    //note: Angular will reuse a component if it is currently being viewed
    //if we have a different category id than previous, then set PageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(this.currentCategoryId + " and " + this.thePageNumber)

    //get the products for the given category id
    this.productService.getProductListPagination(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }
}
