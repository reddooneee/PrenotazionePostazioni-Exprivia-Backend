import { inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { PostazioneService } from "@/app/core/services/postazione.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DashboardService {
    private postazioneService = inject(PostazioneService);

    getDashboardDeskStats(): Observable<{ total: number; available: number }> {
        return this.postazioneService.getAllPostazioni().pipe(
            map((allPostazioni) => {
                const total = allPostazioni.length;
                const available = allPostazioni.filter(
                    (p) => p.stato_postazione === "Disponibile"
                ).length;
                return { total, available };
            })
        );
    }

    getDeskAvailabilityPercentage(available: number, total: number): string {
        if (total === 0) return "0%";
        return `${Math.round((available / total) * 100)}%`;
    }
}
