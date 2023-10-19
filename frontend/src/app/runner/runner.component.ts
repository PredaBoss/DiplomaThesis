import { Component } from '@angular/core';
import { Service } from '../service';
import { MatDialog } from '@angular/material/dialog';
import { AppErrorDialogComponent } from '../app-error-dialog/app-error-dialog.component';
import { LoadFactor } from './loadFactor';
import { ToastrService } from 'ngx-toastr';
import { Semaphore } from './semaphore';

@Component({
  selector: 'app-runner',
  templateUrl: './runner.component.html',
  styleUrls: ['./runner.component.css']
})
export class RunnerComponent {
  loadFactors: LoadFactor[] = [] 
  programList: string[] = [];
  programValues = [
    {value: ['NSR1','30', 'WER2', '30', 'L1R1', '30', 'L2R2', '30'], viewValue: 'NSR1:30, WER2:30, L1R1:30, L2R2:30'},
    {value: ['NSR1','10', 'WER2', '10', 'L1R1', '10', 'L2R2', '10'], viewValue: 'NSR1:10, WER2:10, L1R1:10, L2R2:10'},
    {value: ['NSR1','30', 'WER2', '10', 'L1R1', '20', 'L2R2', '10'], viewValue: 'NSR1:30, WER2:10, L1R1:20, L2R2:10'},
  ];

  isChecked = false;

  constructor(private service: Service, private dialog: MatDialog, private toastr: ToastrService) { 
  }

  ngOnInit(): void {
  }

  start_normal(): void {
    this.service.startSumo(this.getMode()).subscribe( response => {
      if (response.status === 404){
          this.openErrorDialog("No network has been created yet!");
      }
      else if(response.status === 405){
        this.openErrorDialog("Another simulator is already running! Stop that one in order to start a new one!")
      }
    });
  }

  start_optimized(): void {

    this.service.startSumoOptimized(this.getMode()).subscribe( response => {
      console.log(response.status);
      if (response.status === 404){
        this.openErrorDialog("No network has been created yet!");
      }
      else if(response.status === 405){
        this.openErrorDialog("Another simulator is already running! Stop that one in order to start a new one!")
      }
    });
  }

  edit_load_factor(): void {
    const north_left_load = document.getElementById('north_left_load') as HTMLSelectElement;
    const north_front_load = document.getElementById('north_front_load') as HTMLSelectElement;
    const north_right_load = document.getElementById('north_right_load') as HTMLSelectElement;
    const west_left_load = document.getElementById('west_left_load') as HTMLSelectElement;
    const west_front_load = document.getElementById('west_front_load') as HTMLSelectElement;
    const west_right_load = document.getElementById('west_right_load') as HTMLSelectElement;
    const east_left_load = document.getElementById('east_left_load') as HTMLSelectElement;
    const east_front_load = document.getElementById('east_front_load') as HTMLSelectElement;
    const east_right_load = document.getElementById('east_right_load') as HTMLSelectElement;
    const south_left_load = document.getElementById('south_left_load') as HTMLSelectElement;
    const south_front_load = document.getElementById('south_front_load') as HTMLSelectElement;
    const south_right_load = document.getElementById('south_right_load') as HTMLSelectElement;
    this.loadFactors = [
      {from: 'north', to: 'east', loadFactor: north_left_load.value},
      {from: 'north', to: 'south', loadFactor: north_front_load.value},
      {from: 'north', to: 'west', loadFactor: north_right_load.value},
      {from: 'west', to: 'north', loadFactor: west_left_load.value},
      {from: 'west', to: 'east', loadFactor: west_front_load.value},
      {from: 'west', to: 'south', loadFactor: west_right_load.value},
      {from: 'east', to: 'south', loadFactor: east_left_load.value},
      {from: 'east', to: 'west', loadFactor: east_front_load.value},
      {from: 'east', to: 'north', loadFactor: east_right_load.value},
      {from: 'south', to: 'west', loadFactor: south_left_load.value},
      {from: 'south', to: 'north', loadFactor: south_front_load.value},
      {from: 'south', to: 'east', loadFactor: south_right_load.value}
    ];

      this.service.editLoads(this.loadFactors).subscribe( response => {
        if(response.status === 200){
          this.toastr.success('Loads succesfully edited!', 'Notification');
        }
        else{
          this.openErrorDialog("There was a problem in editing the loads!");
        }
    });
  }

  refreshSemaphore(): void {
    const nsr1Duration = this.programList[1];
    const wer2Duration = this.programList[3];
    const l1r1Duration = this.programList[5];
    const l2r2Duration = this.programList[7];

    const semaphores: Semaphore[] = [];
    semaphores.push({moveType: 'NSR1', duration: nsr1Duration});
    semaphores.push({moveType: 'WER2', duration: wer2Duration});
    semaphores.push({moveType: 'L1R1', duration: l1r1Duration});
    semaphores.push({moveType: 'L2R2', duration: l2r2Duration});

    this.service.editSemaphores(semaphores).subscribe( response => {
      if(response.status === 200){
        this.toastr.success('Program succesfully edited!', 'Notification');
      }
      else{
        this.openErrorDialog("There was a problem in editing the traffic lights program!");
      }
  });;
  }

  getMode(): string {
    if (this.isChecked){
      return "training";
    }
    return "normal";
  }

  openErrorDialog(message: string) {
    const dialogRef = this.dialog.open(AppErrorDialogComponent, {
      data: { message: message }
    });
  }
}
