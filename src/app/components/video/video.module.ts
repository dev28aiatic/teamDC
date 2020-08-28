import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { VideoComponent } from './video.component';
import { MaterialModule } from 'src/app/material/material.module';
import { YouTubePlayerModule } from '@angular/youtube-player'

@NgModule({
  declarations: [VideoComponent],
  imports: [
    CommonModule,
    VideoRoutingModule,
    MaterialModule,
    YouTubePlayerModule,

  ]
})
export class VideoModule { }
