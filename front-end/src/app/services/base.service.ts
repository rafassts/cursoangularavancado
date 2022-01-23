import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { LocalStorageUtils } from "../utils/localstorage";

export abstract class BaseService {
    
    protected urlServiceV1: string = environment.apiUrlv1;
    public LocalStorage = new LocalStorageUtils();

    protected obterHeaderJson(){
        return {
            headers: new HttpHeaders({'Content-Type':'application/json'})
        };
    }

    protected ObterAuthHeaderJson() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.LocalStorage.obterTokenUsuario()}`
            })
        };
    }

    //extrai somente o nó "data"
    protected extractData(response: any) {
        return response.data || { }; //caso não encontre data, retorna vazio
    }

    //ou response ou qualquer outra coisa
    protected serviceError(response: Response | any) {

        let customError: string[] = [];

        //caso haja erro desconhecido, concacena com a lista de erros do response
        if (response instanceof HttpErrorResponse) {

            if (response.statusText === 'Unknown Error') {
                customError.push("Ocorreu um erro desconhecido");
                response.error.errors = customError;
            }
        }

       // console.error(response);
        //retorna todos os erros do backend
        return throwError(response);
    }

}