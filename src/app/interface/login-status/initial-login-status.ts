import { Observable } from 'rxjs/Observable';

export abstract class InitialLoginStatus {
    abstract username: Observable<String>;
    abstract setInitialStatus(): void;
}
