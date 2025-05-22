import { inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { PostazioneService } from "@/app/core/services/postazione.service";
import { Observable } from "rxjs";
import { Postazione, StatoPostazione } from "@/app/core/models";

@Injectable({
    providedIn: "root",
})
export class DashboardService {
    private postazioneService = inject(PostazioneService);

/*     getDashboardDeskStats(): Observable<{ total: number; available: number }> {
        return this.postazioneService.getPostazioni().pipe(
            map((allPostazioni: Postazione[]) => {
                const total = allPostazioni.length;
                // const available = allPostazioni.filter(
                //     (p: Postazione) => p.stato_postazione === StatoPostazione.DISPONIBILE
                // ).length;
                return { total };
            })
        );
    } */

    getDeskAvailabilityPercentage(available: number, total: number): string {
        if (total === 0) return "0%";
        return `${Math.round((available / total) * 100)}%`;
    }

    
}
