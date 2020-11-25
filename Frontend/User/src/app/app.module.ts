// ------------ Importovano ------------
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatListModule } from '@angular/material/list';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DropdownModule } from 'angular-custom-dropdown';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxEditorModule } from 'ngx-editor';
import { ChartModule } from 'angular-highcharts';
import { DatePipe } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';


// ------------ Servisi ------------
import { UserInfoService } from './Servisi/user-info.service';
import { AuthService } from './Servisi/auth.service';
import { AuthGuardService } from './Servisi/auth-guard.service';
import { IgreInfoService } from './Servisi/igre-info.service';
import { NavbarService } from './Servisi/navbar.service';
import { BotInfoService } from './Servisi/bot-info.service';
import { TurnirInfoService } from './Servisi/turnir-info.service';
import { KorisnickiProfilService } from './Servisi/korisnicki-profil.service';
import { MultilanguageService } from './Servisi/multilanguage.service';
import { StorageService } from './Servisi/storage.service';
import { MecInfoService } from './Servisi/mec-info.service';

// ------------ Komponente ------------
import { AppComponent } from './app.component';
import { RegistracijaKorisnikaComponent } from './Komponente/registracija-korisnika/registracija-korisnika.component';
import { HomeComponent } from './Komponente/home/home.component';
import { NavbarComponent } from './Komponente/navbar/navbar.component';
import { PrijavaKorisnikaComponent } from './Komponente/prijava-korisnika/prijava-korisnika.component';
import { ListaIgaraComponent } from './Komponente/lista-igara/lista-igara.component';
import { IndexComponent } from './Komponente/index/index.component';
import { AdminComponent } from './Komponente/Admin/admin/admin.component';
import { AdminNavbarComponent } from './Komponente/Admin/admin-navbar/admin-navbar.component';
import { UserNavbarComponent } from './Komponente/user-navbar/user-navbar.component';
import { DodavanjeBotovaComponent } from './Komponente/dodavanje-botova/dodavanje-botova.component';
import { UserHomeComponent } from './Komponente/user-home/user-home.component';
import { AdminHomeComponent } from './Komponente/Admin/admin-home/admin-home.component';
import { ListaKorisnikaComponent } from './Komponente/Admin/lista-korisnika/lista-korisnika.component';
import { DodajIgruComponent } from './Komponente/Admin/dodaj-igru/dodaj-igru.component';
import { OpisIgreComponent } from './Komponente/opis-igre/opis-igre.component';
import { CarouselComponent } from './Komponente/carousel/carousel.component';
import { IgreKontrolaOpcijaComponent } from './Komponente/igre-kontrola-opcija/igre-kontrola-opcija.component';
import { DetaljiIgreComponent } from './Komponente/detalji-igre/detalji-igre.component';
import { PregledTurniraComponent } from './Komponente/pregled-turnira/pregled-turnira.component';
import { ProfilKontrolaComponent } from './Komponente/profil-kontrola/profil-kontrola.component';
import { PregledProfilaComponent } from './Komponente/pregled-profila/pregled-profila.component';
import { IzmenaProfilaComponent } from './Komponente/izmena-profila/izmena-profila.component';
import { AnalizaProfilaComponent } from './Komponente/analiza-profila/analiza-profila.component';
import { FooterComponent } from './Komponente/footer/footer.component';
import { DodajTurnirComponent } from './Komponente/Admin/dodaj-turnir/dodaj-turnir.component';
import { YesNoDialogComponent } from './Komponente/Dijalozi/yes-no-dialog/yes-no-dialog.component';
import { FaqComponent } from './Komponente/faq/faq.component';
import { OnamaComponent } from './Komponente/onama/onama.component';
import { GameSidebarComponent } from './Komponente/Admin/game-sidebar/game-sidebar.component';
import { UpravljanjeIgramaComponent } from './Komponente/Admin/upravljanje-igrama/upravljanje-igrama.component';
import { IzmeniIgruComponent } from './Komponente/Admin/izmeni-igru/izmeni-igru.component';
import { IgraUserComponent } from './Komponente/igra-user/igra-user.component';
import { IgraAdminComponent } from './Komponente/Admin/igra-admin/igra-admin.component';
import { PravljenjeIgracaComponent } from './Komponente/pravljenje-igraca/pravljenje-igraca.component';
import { PregledKorisnikaComponent } from './Komponente/Admin/pregled-korisnika/pregled-korisnika.component';
import { PregledTurniraAdminComponent } from './Komponente/Admin/pregled-turnira-admin/pregled-turnira-admin.component';
import { KupPregledComponent } from './Komponente/kup-pregled/kup-pregled.component';
import { ObradaPrijavaComponent } from './Komponente/Admin/obrada-prijava/obrada-prijava.component';
import { SimulacijaComponent } from './Komponente/simulacija/simulacija.component';
import { PregledLigeComponent } from './Komponente/pregled-lige/pregled-lige.component';
import { KorisniciComponent } from './Komponente/Admin/korisnici/korisnici.component';
import { UputstvoComponent } from './Komponente/uputstvo/uputstvo.component';
import { KorisnikKontrolaComponent } from './Komponente/Admin/korisnik-kontrola/korisnik-kontrola.component';
import { AnalizaKorisnikaComponent } from './Komponente/Admin/analiza-korisnika/analiza-korisnika.component';
import { AdministracijaKorisnikaDialogComponent } from './Komponente/Dijalozi/administracija-korisnika-dialog/administracija-korisnika-dialog.component';
import { PregledNovihTurniraAdminComponent } from './Komponente/Admin/pregled-novih-turnira-admin/pregled-novih-turnira-admin.component';
import { BanUserComponent } from './Komponente/Dijalozi/ban-user/ban-user.component';
import { LeaderboardComponent } from './Komponente/leaderboard/leaderboard.component';
import { TestiranjeBotaComponent } from './Komponente/testiranje-bota/testiranje-bota.component';
import { OopsComponent } from './Komponente/oops/oops.component';
import { PretragaComponent } from './Komponente/pretraga/pretraga.component';




// ------------ Rute ------------
const appRoutes=
[
  { path:'', redirectTo:'home', pathMatch:'full' },
  { path:'home', component:HomeComponent },
  { path:'registracija', component:RegistracijaKorisnikaComponent },
  { path:'prijava', component:PrijavaKorisnikaComponent },
  { path:'igre', component:ListaIgaraComponent },
  { path:'igre/:id', component:OpisIgreComponent },
  { path:'faq', component:FaqComponent},
  { path:'onama', component:OnamaComponent},
  { path:'uputstvo', component:UputstvoComponent },
  { 
    path:'admin', 
    component:AdminComponent,
    canActivate:[AuthGuardService],
    canActivateChild:[AuthGuardService],
    children:
    [
      { path:'', redirectTo:'home', pathMatch:'full' },
      { path:'home', component:AdminHomeComponent },
      { path:'izlistajKorisnike', component:ListaKorisnikaComponent },
      { path:'dodajIgru', component:DodajIgruComponent },
      { path:'dodajTurnir', component:DodajTurnirComponent },
      { path:'game/:id', component:SimulacijaComponent },
      { 
        path:'pregledKorisnika/:id', 
        component:KorisnikKontrolaComponent,
        children:
        [ 
          { path:'', redirectTo:'informacijeKorisnika', pathMatch:'full' },
          { path:'informacijeKorisnika', component:PregledKorisnikaComponent },
          { path:'analizaKorisnika', component:AnalizaKorisnikaComponent }
        ] 
      },
      {  
        path:'igra/:id',
        component:IgraAdminComponent,
        children:
        [
          { path:'', redirectTo:'detalji', pathMatch:'full' },
          { path:'detalji', component:DetaljiIgreComponent },
          { path:'kreirajTurnir', component:DodajTurnirComponent },
          { path:'turniri', component:PregledTurniraAdminComponent },
          { path:'izmeniIgru', component:IzmeniIgruComponent },
          { path:'obradaPrijava', component:ObradaPrijavaComponent },
          { path:'pregledKupa', component:KupPregledComponent },
          { path:'pregledLige', component:PregledLigeComponent },
          { path:'pregledNovogTurnira', component:PregledNovihTurniraAdminComponent },
        ]
      },
      {
        path:'profil',
        component:ProfilKontrolaComponent,
        children:
        [
          { path:'', redirectTo:'izmena_profila', pathMatch:'full'},
          { path:'pregled_profila', component:PregledProfilaComponent },
          { path:'izmena_profila', component:IzmenaProfilaComponent },
          { path:'analiza', component:AnalizaProfilaComponent },
        ]
      },
    ]
  },
  {
    path:'index', 
    component:IndexComponent, 
    canActivate:[AuthGuardService],
    canActivateChild:[AuthGuardService],
    children:
    [
      { path:'', redirectTo:'home', pathMatch:'full' },
      { path:'home', component:UserHomeComponent },
      { path:'lideri', component:LeaderboardComponent },
      { path:'game/:id', component:SimulacijaComponent },
      { path:'test/:bot', component:TestiranjeBotaComponent },
      { 
        path:'igra/:id', 
        component:IgraUserComponent,
        children:
        [
          { path:'', redirectTo:'detalji', pathMatch:'full' },
          { path:'detalji', component:DetaljiIgreComponent },
          { path:'botovi', component:DodavanjeBotovaComponent },
          { path:'turniri', component:PregledTurniraComponent },
          { path:'prijavaZaTurnir', component:PravljenjeIgracaComponent },
          { path:'pregledKupa', component:KupPregledComponent },
          { path:'pregledLige', component:PregledLigeComponent },
        ]
      },
      {
        path:'profil',
        component:ProfilKontrolaComponent,
        children:
        [
          { path:'', redirectTo:'izmena_profila', pathMatch:'full'},
          { path:'pregled_profila', component:PregledProfilaComponent },
          { path:'izmena_profila', component:IzmenaProfilaComponent },
          { path:'analiza', component:AnalizaProfilaComponent },
        ]
      },
      { 
        path:'pregledKorisnika/:id', 
        component:KorisnikKontrolaComponent,
        children:
        [ 
          { path:'', redirectTo:'informacijeKorisnika', pathMatch:'full' },
          { path:'informacijeKorisnika', component:PregledKorisnikaComponent },
          { path:'analizaKorisnika', component:AnalizaKorisnikaComponent }
        ] 
      },
    ] 
  },
  { path:'**', component:OopsComponent }
];



@NgModule({
  declarations: 
  [
    AppComponent,
    RegistracijaKorisnikaComponent,
    HomeComponent,
    NavbarComponent,
    PrijavaKorisnikaComponent,
    IndexComponent,
    ListaIgaraComponent,
    AdminComponent,
    AdminNavbarComponent,
    UserNavbarComponent,
    DodavanjeBotovaComponent,
    UserHomeComponent,
    AdminHomeComponent,
    DodajIgruComponent,
    ListaKorisnikaComponent,
    OpisIgreComponent,
    CarouselComponent,
    IgreKontrolaOpcijaComponent,
    DetaljiIgreComponent,
    PregledTurniraComponent,
    ProfilKontrolaComponent,
    PregledProfilaComponent,
    IzmenaProfilaComponent,
    AnalizaProfilaComponent,
    FooterComponent,
    DodajTurnirComponent,
    YesNoDialogComponent,
    FaqComponent,
    OnamaComponent,
    GameSidebarComponent,
    UpravljanjeIgramaComponent,
    IzmeniIgruComponent,
    IgraUserComponent,
    IgraAdminComponent,
    PravljenjeIgracaComponent,
    PregledKorisnikaComponent,
    PregledTurniraAdminComponent,
    KupPregledComponent,
    ObradaPrijavaComponent,
    SimulacijaComponent,
    PregledLigeComponent,
    KorisniciComponent,
    UputstvoComponent,
    KorisnikKontrolaComponent,
    AnalizaKorisnikaComponent,
    AdministracijaKorisnikaDialogComponent,
    PregledNovihTurniraAdminComponent,
    BanUserComponent,
    LeaderboardComponent,
    TestiranjeBotaComponent,
    OopsComponent,
    PretragaComponent,
    
    
  ],
  imports: 
  [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    HttpClientModule,
    FormsModule,
    AvatarModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CommonModule,
    NgSelectModule,
    CarouselModule.forRoot(),
    MatListModule,
    AngularFontAwesomeModule,
    MatTooltipModule,
    MatDialogModule,
    MatSidenavModule,
    Ng2SearchPipeModule,
    MatRadioModule,
    MatDatepickerModule,
    Ng2SearchPipeModule, 
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    DropdownModule,
    MatProgressSpinnerModule,
    LoadingModule,
    NgxPaginationModule,
    ScrollToModule.forRoot(),
    ChartModule,
    NgxEditorModule,
    PdfViewerModule

  ],
  providers: 
  [
    UserInfoService,
    AuthService,
    AuthGuardService,
    IgreInfoService,
    NavbarService,
    BotInfoService,
    KorisnickiProfilService,
    TurnirInfoService,
    MultilanguageService,
    StorageService,
    MecInfoService,
    DatePipe
  ],
  entryComponents:
  [
    YesNoDialogComponent,
    AdministracijaKorisnikaDialogComponent,
    BanUserComponent,
    PrijavaKorisnikaComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
