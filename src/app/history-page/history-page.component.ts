import { Component } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
})
export class HistoryPageComponent {
  date = new Date();
  fetchedHistory$ = new BehaviorSubject<any[]>([]);
  constructor() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const history = await getDoc(
          doc(getFirestore(), 'Purchase_History', user.uid)
        );
        if (history.exists()) {
          this.fetchedHistory$.next(history.data()['history']);
          console.log('Hämtade historiken:', this.fetchedHistory$);
        }
      }
    });
  }
}
