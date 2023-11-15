import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/shared/map/map.service';
import { MarketplaceService } from 'src/app/feature-modules/marketplace/marketplace.service';
import {Tour} from "../../tour-authoring/tour/model/tour.model";
import {PagedResults} from "../../../shared/model/paged-results.model";

@Component({
  selector: 'xp-tour-search',
  templateUrl: './tour-search.component.html',
  styleUrls: ['./tour-search.component.css']
})
export class TourSearchComponent implements OnInit {

  range: number = 0;
  latitude: number = 0;
  longitude: number = 0;
  isListVisible: boolean = false;

  tours: Tour[] = [];
  brTura: number = 0;

  constructor(private service: MarketplaceService, private cordinateService: MapService) {}

  searchForm = new FormGroup({
    range: new FormControl(0, [Validators.min(0), Validators.required]),
  });

  ngOnInit() {
    this.cordinateService.coordinate$.subscribe((coordinates) => {
      this.latitude = coordinates.lat;
      this.longitude = coordinates.lng;
    });
  }

  search(): void {
    if (this.searchForm.valid && this.latitude != 0 && this.longitude != 0) {

      this.service.getToursByLocation(this.latitude, this.longitude, this.searchForm.value.range || 0).subscribe({
        next: (result: PagedResults<Tour>) => {
          this.isListVisible = true;
          this.tours = result.results;
          this.brTura = this.tours.length;
          console.log(this.brTura);
        },
        error: (err) => {
          this.isListVisible = false;
          console.error('Error: ', err);
        }
      });

    }
  }
}
