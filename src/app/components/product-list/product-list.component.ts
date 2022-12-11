import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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
  thePageSize: number = 5
  theTotalElements: number = 0

  previousKeyword: string = ""

  constructor(public productService: ProductService, private route: ActivatedRoute, public cartService: CartService, private toastr: ToastrService) { }

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

    //if we have different keyword than previous
    //then set thePageNumber = 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1
    }

    this.previousKeyword = theKeyword
    console.log(theKeyword+" and "+this.thePageNumber)

    //search for product using that 'keyword'
    this.productService.searchProductPagination(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(this.processResult())
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products
      this.thePageNumber = data.page.number + 1
      this.thePageSize = data.page.size
      this.theTotalElements = data.page.totalElements
    }
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
      this.processResult()
    );
  }

  updatePageSize(myPageSize: string) {
    this.thePageSize = +myPageSize
    this.thePageNumber = 1
    this.listProducts()
  }

  addToCart(item: Product) {
    const theItemInCart = new CartItem(item)
    this.cartService.addToCart(theItemInCart)
    this.toastr.success(`Đã thêm ${item.name} vào giỏ hàng thành công!`)
  }
}
