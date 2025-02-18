import { Category } from "./category";
import { fetchData } from "../functions/apicall";
import { Character } from "./character";

enum operations{
    AND, OR
}

class Query{
    private findTopOp(str: string, op: operations){
        let pcount = 0;
        //Looking for Or operators
        if (op == operations.OR){
            for (let i = 0; i < str.length - 1; i++) {
                if (str[i] === '(') pcount++;
                else if (str[i] === ')') pcount--;
                if (pcount === 0 && str[i] === '|' && str[i + 1] === '|') {
                    return i;
                }
            }
        }else{
            //Looking for And Operators
            for (let i = 0; i < str.length; i++) {
                if (str[i] === '(') pcount++;
                else if (str[i] === ')') pcount--;
                if (pcount === 0 && str[i] === "&") {
                    return i;
                }
            }
        }
        return -1;
    }

    public op: operations| null = null;
    public left : Query | Category | null = null;
    public right : Query | Category | null = null;

    constructor(str: string){
        str = str.trim();
        if (str === '')return;
        if (str.startsWith("(")){
            let count = 1;
            let i = 1;
            
            while (i < str.length && count > 0) {
                if (str[i] === '(') count++;
                if (str[i] === ')') count--;
                i++;
            }
            if (count == 0){
                const innerExpr = str.substring(1, i - 1);
                const restExpr = str.substring(i).trim();
                if (restExpr.length > 0) {
                    if (restExpr.startsWith('||')) {
                        this.op = operations.OR;
                        this.left = new Query(innerExpr);
                        this.right = new Query(restExpr.substring(2).trim());
                    } else if (restExpr.startsWith('&')) {
                        this.op = operations.AND;
                        this.left = new Query(innerExpr);
                        this.right = new Query(restExpr.substring(1).trim());
                    } else {
                        throw new Error(`Invalid operator after parentheses: ${restExpr}`);
                    }
                } else {
                    const innerQuery = new Query(innerExpr);
                    this.op = innerQuery.op;
                    this.left = innerQuery.left;
                    this.right = innerQuery.right;
                }
                return;
            }
            else{
                throw new Error("Mismatched Parentheses")
            }
        }
        const orIndex = this.findTopOp(str, operations.OR);
        if (orIndex !== -1) {
            this.op = operations.OR;
            this.left = new Query(str.substring(0, orIndex).trim());
            this.right = new Query(str.substring(orIndex + 2).trim());
            return;
        }
        const andIndex = this.findTopOp(str, operations.AND);
        if (andIndex !== -1) {
            this.op = operations.AND;
            this.left = new Query(str.substring(0, andIndex).trim());
            this.right = new Query(str.substring(andIndex + 1).trim());
            return;
        }
        this.left = new Category(str);
    }

    public async fillOut(){
        if (this.left instanceof Query){
            this.left.fillOut();
        }
        else if (this.left instanceof Category){
            const c: Category[] = await fetchData("category", "name", this.left.name) ;
            this.left = c[0];
        }
        if (this.right instanceof Query){
            this.right.fillOut();
        }
        else if (this.right instanceof Category){
            const d = await fetchData("category", "name", this.right.name);
            this.right = d[0];
        }
    }

    private static filter(li: Character[]){
        const seen = new Set<number>();
        return li.filter(char => {
            if (char?.id == null) return false;
            if (seen.has(char.id)) return false;
            seen.add(char.id);
            return true;
        });
    }

    public async grabChars(): Promise<Character[]>{
        let le: Character[];
        if (this.left instanceof Query){
            le = await this.left.grabChars();
        }
        else if(this.left == null){
            return []
        }
        else{
            le = await fetchData("card", "category", this.left.name);
        }
        if (this.op == null || this.right == null) return le;
        let ri: Character[];
        if (this.right instanceof Query){
            ri = await this.right.grabChars();
        }
        else if (this.right instanceof Category){
            ri = await fetchData("card", "category", this.right.name);
        }
        else{
            return le;
        }

        const leftset:Set<number> = new Set(le.map(c => c.id));
        const rightset: Set<number> = new Set(ri.map(c=> c.id));
        let resset: Set<number>;
        if (this.op == operations.AND){
            resset = leftset.intersection(rightset)
        }
        else{
            resset = leftset.union(rightset)
        }
        return Query.filter(le.concat(ri).filter(c => resset.has(c.id)))
    }
}

export {Query, operations};