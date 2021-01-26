// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// parayer :: ProjectComponent
// Project management tool
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HttpClient } 
	from '@angular/common/http';
import { AfterContentChecked, Component }
	from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } 
	from '@angular/forms';
import { MatChipSelectionChange } 
	from '@angular/material/chips';
import { ErrorStateMatcher } 
	from '@angular/material/core';	
import { ActivatedRoute, Router }
	from '@angular/router';	

import * as _
	from 'lodash';
import { ActArea } from '../act-area/act-area.model';
import { ActGroup } from '../act-group/act-group.model';

import { UserService } 
	from '../core.services';
import { DateTimeUtil, History, Note, UI }
	from '../core.utils';
import { NavigationComponent }
	from '../navigation/navigation.component';
import { Project, ProjectTask } 
	from './project.model';

@Component({
	templateUrl: 	'./project.component.html',
	styleUrls: 		['./project.component.css']
})
export class ProjectComponent implements AfterContentChecked {
	
	project :Project|null = null;
	
	selectedTab :number = 0;

	constructor(
			private _route :ActivatedRoute, 
			private _http :HttpClient, 
			private _nav :NavigationComponent,
			private _router :Router) {

		this._nav.showWait(true);
		let projectId = this._route.snapshot.paramMap.get('id'); 
		if(projectId!=null)
			Project.load(projectId, this._http).then((p :Project) => {
				this.project = p;
				this.fcName.setValue(this.project.name);
				this.fcDescr.setValue(this.project.descr);
				this.fcDateStart.setValue(this.project.dateStart);
				this.fcDateEnd.setValue(this.project.dateEnd);
				this.fcEffortUnit.setValue(this.project.effortUnit);
				this.fcEffortCap.setValue(this.project.effortCap);
				ActGroup.load(this.project.actGrp, this._http).then((g: ActGroup) => {
					ActArea.load(g.actArea, this._http).then((a: ActArea) => {
						this._nav.setLocation(`Project`, 
						[
							{ "text": a.name, "route": a.getRoute() }, 
							{ "text": g.name, "route": g.getRoute() },
							{ "text": this.project!.name, "route": this.project!.getRoute() }
						], 'map');
					});
				});
				this._nav.showWait(false);
			}, (reason :string) => {
				this._nav.showSnackBar(reason);
				this._nav.showWait(false);
			});
	}

	ngAfterContentChecked(): void {
	
		if(this.selectedTab==1 || this.selectedTab==2)
			_.forEach(document.querySelectorAll('textarea'), (t) => {
				UI.textAreaFitContents(t);
			});		
	}
	
	loadTabContent(i :number) : void {
		
		this.notesTextFilter = '';
		this.tasksTextFilter = '';
		this.taskSort = 'pc';
		this.historyTextFilter = '';
		this.historyDateFilter = '';
		
		this.selectedTab = i;
		switch(i) {
		case 1:		// -- Notes --
			if(this.project!=null) {
				this._nav.showWait(true);
				Note.getFor(this.project._id, this._http).then((n :Array<Note>) => {
					this.project!.notes = n;
					this._nav.showWait(false);
				}, (reason) => {
					this._nav.showSnackBar(reason);
				});
			}
			break;
		case 2:		// -- Tasks --
			if(this.project!=null) {
				this._nav.showWait(true);
				ProjectTask.getFor(this.project._id, this._http).then((t :Array<ProjectTask>) => {
					this.project!.tasks = t;
					this.sortTasks(undefined);
					this._nav.showWait(false);
				}, (reason) => {
					this._nav.showSnackBar(reason);
				});
			}
			break;
		case 3:		// -- Files --
			console.log('Files - To be implemented!')
			break;
		case 4:		// -- Appointments --
			console.log('Appointments - To be implemented!')
			break;
		case 5:		// -- Histoy --
			// FIXME Not reloading on tab change
			if(this.project!=null) {
				this._nav.showWait(true);
				History.getFor(this.project._id, this._http).then((h :Array<History>) => {
					this.project!.history = h;
					this.computeHistoryDateFilters();				
					this._nav.showWait(false);
				}, (reason) => {
					this._nav.showSnackBar(reason);
				});
			}
			break;
		default:	// -- General --
		}
	}
	
	// -- GENERAL tab --
	fcName :FormControl = new FormControl('', [Validators.required]);
	fcDescr :FormControl = new FormControl('');
	fcDateStart :FormControl = new FormControl('');
	fcDateEnd :FormControl = new FormControl('');
	fcEffortUnit :FormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcEffortCap = new FormControl('', [Validators.pattern('[0-9]+:[0-9]{2}')]);
	fcErr :ErrorStateMatcher = new ProjectFormErrorStateMatcher();	
	
	formIsValid() :boolean {
	
		return !(this.fcErr.isErrorState(this.fcName, null) ||
			this.fcErr.isErrorState(this.fcDescr, null) ||
			this.fcErr.isErrorState(this.fcDateStart, null) ||
			this.fcErr.isErrorState(this.fcDateEnd, null) ||
			this.fcErr.isErrorState(this.fcEffortUnit, null) ||
			this.fcErr.isErrorState(this.fcEffortCap, null));
	}
	
	save() :void {
		
		if(!this.formIsValid())
			this._nav.showSnackBar('Errors found, can\'t save!');
		else {
			let p = this.project!;
			p.name = this.fcName.value;
			p.descr = this.fcDescr.value;
			p.dateStart = this.fcDateStart.value;
			p.dateEnd = this.fcDateEnd.value;
			p.effortUnit = this.fcEffortUnit.value;
			p.effortCap = this.fcEffortCap.value;			
			p.save(this._http).then(() => {
				History.make(`Updated project info`, p._id, null, 60 * 60 * 1000, this._http).then(() => {}, (reason) => {
					this._nav.showSnackBar(reason);
				});
				this._router.navigateByUrl('/act-grid');
			}, (reason) => {
				this._nav.showSnackBar(`Project saving failed! ${reason}`);
			});
		}
	}
	
	// -- NOTES tab --
	notesTextFilter :string = '';
	notesFilteredOut :number = 0;
	
	setNotesTextFilter(e :Event) :void {
		
		this.notesTextFilter = (e.target as HTMLInputElement).value;
	}
	
	filterNotes() :void {
		
		this.notesFilteredOut = 0;
		let textFilter = this.notesTextFilter.toUpperCase();
		if(this.project!=null && this.project.notes!=null) {
			_.forEach(this.project.notes, (n) => {
				let noteCntnr = document.querySelector(`#project-note-${n._id}`) as HTMLElement;
				if((n.summary + n.descr).toUpperCase().indexOf(textFilter)!=-1)
					noteCntnr.style.display = '';
				else {
					noteCntnr.style.display = 'none';
					this.notesFilteredOut++;
				}
			});
		}
	}
	
	newNote() :void {
		
		this._nav.showWait(true);
		let p = this.project!;
		Note.create(p._id, this._http).then((n :Note) => {
			p.notes.unshift(n);
			this._nav.showWait(false);
			History.make(`Added a new note`, p._id, n._id, null, this._http).then(() => {}, (reason) => {
				this._nav.showSnackBar(reason);
			});
		}, (reason) => {
			this._nav.showSnackBar(reason);
		});
	}
	
	updateNote(n :Note) :void {
	
		if(n.modified) {
			if(n.summary.trim()=='')
				this._nav.showSnackBar('A note summary is required!');
			else
				n.update(this._http).then(() => {
					History.make('Updated note', this.project!._id, n._id, 60 * 60 * 1000, this._http)	
				}, (reason) => {
					this._nav.showSnackBar(reason);
				});
		}
	}
	
	deleteNote(n :Note, confirmed ?:boolean) :void {
		
		if(!confirmed) {
			this._nav.showSimpleConfirmDialog('Please confirm', 'Note deletion can\'t be undone, proceed?', () => {
				this.deleteNote(n, true);
			}, () => {
				// Nothing to do
			});
		}
		else {
			let p = this.project!;
			n.delete(this._http).then(() => {
				_.remove(p.notes, (pn) => {
					return pn._id==n!._id;
				});
				History.make(`Deleted note ${n.summary}`, this.project!._id, n._id, null, this._http);
				this._nav.showSnackBar('Note deleted!');
			}, (reason) => {
				this._nav.showSnackBar(`Note deletion failed! ${reason}`);
			});
		}
	}
	
	// -- TASKS tab --
	tasksTextFilter :string = '';
	tasksFilteredOut :number = 0;
	
	setTasksTextFilter(e :Event) :void {
		
		this.tasksTextFilter = (e.target as HTMLInputElement).value;
	}
	
	tasksCompleted() :number {
		
		let p = this.project!;
		let n :number = 0;
		_.forEach(p.tasks, (t) => {
			if(t.pc=='100')
			n++;
		});
		return n;
	}
	
	filterTasks() :void {
	
		this.tasksFilteredOut = 0;
		let textFilter = this.tasksTextFilter.toUpperCase();
		if(this.project!=null && this.project.tasks!=null) {
			_.forEach(this.project.tasks, (t) => {
				let taskCntnr = document.querySelector(`#project-task-${t._id}`) as HTMLElement;
				if((t.summary + t.descr).toUpperCase().indexOf(textFilter)!=-1)
					taskCntnr.style.display = '';
				else {
					taskCntnr.style.display = 'none';
					this.tasksFilteredOut++;
				}
			});
		}
	}	

	taskSort :string = 'pc';

	// TODO 2nd click on same chip should reverse the sort
	// FIXME Sorting by due date not working
	sortTasks(e :MatChipSelectionChange|undefined) :void {

		if(e && !e.selected)
			return;
		else {		
			let t = this.project!.tasks;
			if(this.taskSort=='created.date' || this.taskSort=='dateDue')
				t = _.sortBy(t, [this.taskSort])
			else if(this.taskSort=='pc') 
				t = _.sortBy(t, [function(task) { return parseInt(task.pc); }]);
			else
				t = _.reverse(_.sortBy(t, [this.taskSort]));
			this.project!.tasks = t;
		}
	}
	
	
	newTask() :void {
		
		let p = this.project!;
		ProjectTask.create(p._id, UserService.getLoggedUser().id, this._http).then((t :ProjectTask) => {
			p.tasks.unshift(t);
			this.sortTasks(undefined);
			History.make(`Added a new task`, p._id, t._id, null, this._http).then(() => {}, (reason) => {
				this._nav.showSnackBar(reason);
			});
		}, (reason) => {
			this._nav.showSnackBar(reason);
		});
	}
	
	// FIXME PUT results in conflict sometimes, find out why
	updateTask(t :ProjectTask) :void {
		
		if(t.modified) {
			if(t.summary.trim()=='')
				this._nav.showSnackBar('A task summary is required!');
			else
				t.update(this._http).then(() => {
					this.sortTasks(undefined);
					History.make('Updated task', this.project!._id, t._id, 60 * 60 * 1000, this._http)
				}, (reason) => {
					this._nav.showSnackBar(reason);
			});
		}
	}
	
	deleteTask(t :ProjectTask, confirmed ?:boolean) :void {
		
		if(!confirmed)
			this._nav.showSimpleConfirmDialog('Please confirm', 'Task deletion can\'t be undone, proceed?', () => {
				this.deleteTask(t, true);
			}, () => {
				// Nothing to do
			});
		else {
			let p = this.project!;
			t.delete(this._http).then(() => {
				_.remove(p.tasks, (pt) => {
					return pt._id==t!._id;
				});
				History.make(`Deleted task ${t.summary}`, this.project!._id, t._id, null, this._http);
				this._nav.showSnackBar('Task deleted!');
			}, (reason) => {
				this._nav.showSnackBar(`Task deletion failed! ${reason}`);
			});
		}
	}
	
	purgeTasks(confirmed ?:boolean) :void {
		
		// TODO Would be fine to have snackbar showing actual number of tasks deleted
		if(!confirmed)
			this._nav.showSimpleConfirmDialog('Please confirm', 'Task purge can\'t be undone, proceed?', () => {
				this.purgeTasks(true);
			}, () => {
				// Nothing to do
			});		
		else 
			_.forEach(this.project!.tasks, (t) => {
				if(t.pc=='100')
					this.deleteTask(t, true);
			});
	}
	
	// -- FILES tab --
	
	// -- APPOINTMENTS tab --
	
	// -- HISTORY tab -- 
	historyTextFilter :string = '';
	historyDateFilter :string = '';
	historyDateFilterOptions :Array<{"value": string, "text": string, order: number}> = [];
	historyFilteredOutEntries :number = 0;
	
	setHistoryTextFilter(e :Event) :void {
	
		this.historyTextFilter = (e.target as HTMLInputElement).value;
	}
	
	filterHistory() :void {
		
		// TODO Text filter should also work on refchips content
		this.historyFilteredOutEntries = 0;
		let textFilter = this.historyTextFilter.toUpperCase();
		if(this.project!=null && this.project.history!=null) {
			_.forEach(this.project.history, (h) => {
				let entryCntnr = document.querySelector(`#project-hist-entry-${h._id}`) as HTMLElement;
				if(h.summary.toUpperCase().indexOf(textFilter)!=-1 &&
						(this.historyDateFilter=='' || h.dateFilterLabels.indexOf(this.historyDateFilter)!=-1))
					entryCntnr.style.display = '';
				else {
					entryCntnr.style.display = 'none';
					this.historyFilteredOutEntries++;
				}
			});
		}
	}
	
	computeHistoryDateFilters() :void {
		
		let self = this;
		let filtersAdded :Array<string> = []; 
		this.historyDateFilterOptions = [];
		this.historyDateFilterOptions.push({"value": "", "text": "At any time", order: 999})
		_.forEach(this.project?.history, function(h :any) {
			h .dateFilterLabels = [];
			if(DateTimeUtil.isToday(h.timestamp)) {
				h.dateFilterLabels.push('today');
				if(filtersAdded.indexOf('today')==-1) {
					filtersAdded.push('today');
					self.historyDateFilterOptions.push({"value": "today", "text": "Today", order: 0});
				}
			}
			if(DateTimeUtil.isYesterday(h.timestamp)) {
				h.dateFilterLabels.push('yesterday');
				if(filtersAdded.indexOf('yesterday')==-1) {
					filtersAdded.push('yesterday');
					self.historyDateFilterOptions.push({"value": "yesterday", "text": "Yesterday", order: -1});
				}
			}
			if(DateTimeUtil.isThisWeek(h.timestamp)) {
				h.dateFilterLabels.push('thisweek');
				if(filtersAdded.indexOf('thisweek')==-1) {
					filtersAdded.push('thisweek');
					self.historyDateFilterOptions.push({"value": "thisweek", "text": "This week", order: -7});
				}
			}
			if(DateTimeUtil.isLastWeek(h.timestamp)) {
				h.dateFilterLabels.push('lastweek');
				if(filtersAdded.indexOf('lastweek')==-1) {
					filtersAdded.push('lastweek');
					self.historyDateFilterOptions.push({"value": "lastweek", "text": "Last week", order: -14});
				}
			}
			if(DateTimeUtil.isThisMonth(h.timestamp)) {
				h.dateFilterLabels.push('thismonth');
				if(filtersAdded.indexOf('thismonth')==-1) {
					filtersAdded.push('thismonth');
					self.historyDateFilterOptions.push({"value": "thismonth", "text": "This month", order: -30});
				}
			}
			if(DateTimeUtil.isLastMonth(h.timestamp)) {
				h.dateFilterLabels.push('lastmonth');
				if(filtersAdded.indexOf('lastmonth')==-1) {
					filtersAdded.push('lastmonth');
					self.historyDateFilterOptions.push({"value": "lastmonth", "text": "Last month", order: -60});
				}
			}
			if(h.dateFilterLabels.length==0) { 
				let label = `${h.timestamp.getFullYear()}-${String(h.timestamp.getMonth()+1).padStart(2, '0')}`;
				h.dateFilterLabels.push(label);
				if(filtersAdded.indexOf(label)==-1) {
					filtersAdded.push(label);
					// TODO "year-month" in current locale needed for text field
					self.historyDateFilterOptions.push({"value": label, "text": label, order: -90});
				}
			}
			self.historyDateFilterOptions = _.reverse(_.sortBy(self.historyDateFilterOptions, ['order', 'value']));		
		});		
	}	
}

export class ProjectFormErrorStateMatcher implements ErrorStateMatcher {
	
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		
		const isSubmitted = form && form.submitted;
    	return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  	}
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------