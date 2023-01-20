import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  

  moviesStorage: any[] = [];
  favMovies: any[] = []; 


  constructor(private storage: StorageService) { 
        this.init(); 
  }

  async init() {

   // var favMoviesJSON: string | null = localStorage.getItem("favmovies");
    var favMoviesJSON: string | null = await this.storage.get("favmovies"); //slouží pro načtení seznamu favmovies z localstorage

    if (favMoviesJSON != null){
      this.moviesStorage = JSON.parse(favMoviesJSON); // poukd se podaří načíst favMovies tak naparsuje do movieStorage
    }

    
    console.log(this.moviesStorage);
    this.favMovies.push(...this.moviesStorage );
  }




  checkIfFavourite(id: string): boolean{
    
      for (let i = 0; i < this.favMovies.length; i++) {
        if(id == this.favMovies[i].id){
          return true;
        }
      }

      return false;
  }


  addToFavourites(movie: any){
    
    // pokud je film už přidaný tak bude ze seznamu oblíbených odstraněn

    if(!this.checkIfFavourite(movie.id)){
      this.favMovies.push(movie);
      console.log("pridavam");
      console.log(this.favMovies);
    }
    else{
      const index = this.favMovies.findIndex(object => {
        return object.id === movie.id;
      });
      
      this.favMovies.splice(index, 1);
      console.log("odstranuju");
      console.log(this.favMovies);
    }

    
    
  }
}
