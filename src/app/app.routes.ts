import {Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home').then((m) => m.Home),
    },
    {
        path: 'quiz',
        loadComponent: () =>
            import('./pages/quiz/quiz').then((m) => m.Quiz),
    },
    {
        path: 'finish',
        loadComponent: () =>
            import('./pages/finish/finish').then((m) => m.Finish),
    },
    {
        path: 'about',
        loadComponent: () =>
            import('./pages/about/about').then((m) => m.About),
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
