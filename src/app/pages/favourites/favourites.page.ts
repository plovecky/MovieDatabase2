import { Component, OnInit } from '@angular/core';
import { FavouritesService } from 'src/app/services/favourites.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
 
})
export class FavouritesPage implements OnInit {

  favMovies: any[];
  imageBaseUrl = environment.images;
  route: string = "movie/";

  constructor(private favouritesService: FavouritesService) {
    this.favMovies = [];  
  }

  ngOnInit() {
    if(this.favouritesService != null){
      this.favMovies = this.favouritesService.favMovies; 
    }
  }





}
