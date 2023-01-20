import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { FavouritesService } from 'src/app/services/favourites.service';
import { MoviesService } from 'src/app/services/movies.service';
import { environment } from 'src/environments/environment';

import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],

  
})
export class MovieDetailsPage implements OnInit {
  movie: any = null;
  imageBaseUrl = environment.images;
  id: string | null = "";
  favourite: boolean = false;

  hvezda: string = "heart-outline";

  runtimeH: number;
  runtimeM: number;




  constructor(private route: ActivatedRoute, private moviesService: MoviesService, private favouritesService: FavouritesService, private storage: StorageService) {
    this.runtimeH = 0;
    this.runtimeM = 0;
  }

  ngOnInit() {
    
    this.id = this.route.snapshot.paramMap.get('id');
    this.moviesService.getMovieDetails(this.id).subscribe((res) => {
      console.log(res);
      this.movie = res;
      //api vrací délku filmu v minutách proto to rozdělení 
      this.runtimeH = Math.floor(this.movie.runtime/60); 
      this.runtimeM = this.movie.runtime%60;
    });

    //kontrola jestli je film přidaný do oblíbených 
    if(this.id != null){
      this.favourite = this.favouritesService.checkIfFavourite(this.id);
    }

    if(this.favourite){
      this.hvezda = "heart"; //v případě že je oblíbený se srdíčko/hvězda vybarví
    }

    
  }

  // při opuštění detailů filmu se aktualizuje seznam oblíbených filmů v localStorage
  ionViewWillLeave(){
    //localStorage.setItem("favmovies",JSON.stringify(this.favouritesService.favMovies));
    this.storage.set("favmovies", JSON.stringify(this.favouritesService.favMovies));
  }

  
  addToFavourites(event: any){

    console.log(event); 
    this.favouritesService.addToFavourites(this.movie);
    
    if(this.id != null){
      this.favourite = this.favouritesService.checkIfFavourite(this.id);
    }
    
    if(this.favourite){
      this.hvezda = "heart";
    }
    else{
      this.hvezda = "heart-outline";
    }

  }

}
