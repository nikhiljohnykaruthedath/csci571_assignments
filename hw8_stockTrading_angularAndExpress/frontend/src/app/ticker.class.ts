export class Search {
    constructor(public name: string, public ticker: string) { }
}

export interface ISearchResponse {
    results: Search[];
}