import { Character } from "../types/character";

function get_synergy_score(team: Character[]) {
    let linkscore: number = 0;
    let linkset: Map<string, number> = new Map();
    for (let index = 0; index < team.length; index++) {
        let char = team.at(index);
        let charlinks = char?.links;
        if (!charlinks) continue;
        for (let i = 0; i < charlinks.length; i++) {
            let link = charlinks[i];
            if (!link) continue;
            if (linkset.has(link)) {
                let num = linkset.get(link) ?? 0;
                linkscore += num;
                linkset.set(link, num * 2);
            } else {
                linkset.set(link, 1);
            }
        }
    }
    return linkscore;
}

function num_links_active (team:Character[]){
    let linkset: Map<string, number> = new Map();
    for (let index = 0; index < team.length; index++) {
        let char = team.at(index);
        let charlinks = char?.links;
        if (!charlinks) continue;
        for (let i = 0; i < charlinks.length; i++) {
            let link = charlinks[i];
            if (!link) continue;
            if (linkset.has(link)) {
                let num = linkset.get(link) ?? 0;
                linkset.set(link, num +1);
            } else {
                linkset.set(link, 1);
            }
        }
    }
    return linkset.values().reduce((s, val) =>s + val > 1 ? 1 : 0, 0);
}

export {
    get_synergy_score,
    num_links_active
};