import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatView } from './pages/chat-view/chat-view';

const routes: Routes = [
    {
        path: '',
        component: ChatView,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
