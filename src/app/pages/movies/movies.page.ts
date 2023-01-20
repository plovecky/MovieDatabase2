import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal, LoadingController } from '@ionic/angular';
import { MoviesService } from 'src/app/services/movies.service';
import { environment } from 'src/environments/environment';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {

  movies: any[] = [];
  currentPage = 1;
  imageBaseUrl = environment.images;

  //modal
  name: string | undefined;
  @ViewChild(IonModal) modal: IonModal | undefined;

  //modal - checkbox
  genres: any[] | undefined;
  checkedGenres: number[] = [];
  filtrMovies: any[] = [];// seznam filtrovaných filmů

  constructor(private moviesService: MoviesService, private loadingCtrl: LoadingController) { 

  }

  async ngOnInit() {

    this.loadMovies();

    this.genres = await this.loadGenres();
    console.log(this.genres);
    console.log(this.movies);

    
  }


  async loadMovies(event?: InfiniteScrollCustomEvent){

    //loading screen
    const loading = await this.loadingCtrl.create({
    message: "Loading...",
    spinner: "bubbles",
  });

  await loading.present();
  
  this.moviesService.getTopRatedMovied(this.currentPage).subscribe((res) => {
     loading.dismiss();
    this.movies.push(... res.results);  //přidání filmů z další stránky do seznamu filmů //těm ... se říká spread 
    console.log(res);
  })

  event?.target.complete();
  }


async loadMore(event: InfiniteScrollCustomEvent){
  this.currentPage++; // navýšší číslo stránku a tím při dalším načtení dojde k přidání nové stránky do seznamu filmů
  this.loadMovies(event);

  // pokud došlo k výběru žánrů, tak se znovu zavolá funkce loadFilterMovies
  if(this.checkedGenres.length != 0){
    const loading = await this.loadingCtrl.create({
      message: "Loading...",
      spinner: "bubbles",
    });

    await loading.present();

    this.loadFilterMovies();
    loading.dismiss();
  }

}

//VYHLEDÁVÁNÍ FILMŮ
toggleSearch(){
  console.log("zadavam hodnotu");
}

async submitSearch(event: any){
  console.log("vyhledavam"); 
  const query = event.target.value.toLowerCase();
  console.log(query);



  if(query != ""){
    this.movies = [];

      //loading screen
  const loading = await this.loadingCtrl.create({
    message: "Loading...",
    spinner: "bubbles",
  });

  await loading.present();

    this.moviesService.getSearchedMovies(query).subscribe((res) => {
      loading.dismiss();
      this.movies.push(... res.results);
    })
  }
}

//modal
async onWillDismiss(event: Event) {
  const ev = event as CustomEvent<OverlayEventDetail<string>>;

  if (ev.detail.role === 'confirm') { //pkud potvrdíme výběr žánrů

    if(this.genres != undefined){
      //přidám vybrané žánry do proměnné checkedGenres
    this.genres.forEach(item => {
      if(item.isChecked == true && !this.checkedGenres.includes(item.id)){
        this.checkedGenres.push(item.id);
      }

      //pokud je odškrnutý tak se odstraní ze seznamu
      if(item.isChecked == false && this.checkedGenres.includes(item.id)){
        const index = this.checkedGenres.indexOf(item.id);
        this.checkedGenres.splice(index, 1);
      }
    });
  }

    if(this.checkedGenres.length != 0){
    const loading = await this.loadingCtrl.create({
      message: "Loading...",
      spinner: "bubbles",
    });

    this.filtrMovies = [];
    this.loadFilterMovies();
    await loading.present();

    //opakuje načátíní filmů dokud jich není alespon 20
    while(this.filtrMovies.length<=20){
      this.currentPage++;
      await this.loadMovies();
      this.loadFilterMovies();
    }
    loading.dismiss();
  }
  }
}

cancel(){ //cancel for modal
  if(this.modal != undefined){
    this.modal.dismiss(null, 'cancel');
  }
  
}

confirm(){ // confirm for modal
  if(this.modal != undefined){
    this.modal.dismiss(this.name, 'confirm');
  }
  
  

}

//vrátí seznam žánrů
async loadGenres(): Promise<any[]>{

   let arr: any[] = [];

   const loading = await this.loadingCtrl.create({
    message: "Loading...",
    spinner: "bubbles",
  });

  await loading.present();

   this.moviesService.getMovieGenres().subscribe((res) =>{  
    loading.dismiss();    
    res.genres.forEach((genre) => {
      arr.push(
        {
          id: genre.id,
          name: genre.name,
          isChecked: false
        });
    });
    });

  return arr;
}

//funkce načte do proměné filtrMovies filmy se zvoleným žánrem
loadFilterMovies(){
    
    this.movies.forEach((movie) => { //projde seznam movies a filmy s žánrem přidá do seznamu filtrMovies
        movie.genre_ids.forEach((genre: number) => {
          if(this.checkedGenres.includes(genre) && !this.filtrMovies.includes(movie)){
            this.filtrMovies.push(movie);
          }
        });
    });
}

refresh(){ //načte stránku znovu, používám ke zrušení všech filtrů a hledání
  window.location.reload();
}

}
