/*
function punto_in_poligono(punto, poligono){
    while(true){

    // minimo 3 vertici oppure considerato punto esterno.

    // trova la prima concavità se c'è, ovvero
    // il primo vertice che rende questo poligono un poligono concavo.

    // senza concavità il poligono è convesso.
    // (la gestione dei poligoni convessi è semplice
    // e si combina con questa casistica dei poligoni anche concavi
    // se almeno una concavità è presente).

    // se il poligono è concavo:

    // 1 - forma un triangolo di concavità
    // con il vertice concavo ed i 2 vertici adiacenti

    // 2 - se il punto è nel triangolo di concavità (passo 1)
    // il punto è fuori

    // 3 - forma un nuovo poligono con questa concavità rimossa
    // (o meglio con rimosso il punto della prima concavità)

    // 4 - ripeti ma usando il nuovo poligono con
    // quel punto di concavità rimosso (passo 3) come poligono da testare
    }
}
*/

function in_concave_polygon({ x, y }, polygon) {

    // polygon is a list of points
    // x, y is the point to test

    // returns true if the point is inside the polygon
    // returns false if the point is outside the polygon

    // loop until returns
    while (true) {

        // minimum of 3 vertices
        if (polygon.length < 3)
            return false;

        // find the first concavity vertex if there is one
        let p = polygon;
        let first_concavity_vertex = null;

        // loop index with wrap-around
        const looped_index = (index) => index < polygon.length ?
            (index < 0 ? index + polygon.length : index) : index - polygon.length;

        // loop through all the vertices of the polygon
        for (let point_index = 0; point_index < polygon.length; point_index++) {

            // if the vertex is a concavity
            const is_concavity = 1 == side(
                p[looped_index(point_index + 1)],
                p[looped_index(point_index - 1)],
                p[looped_index(point_index)]
            );

            // if the vertex is a concavity
            if (is_concavity) {
                // then the first concavity vertex is found
                first_concavity_vertex = point_index;
                // exit the loop
                break; // break means only 1 vertex at most (or 0)
            }
        } // end of for loop

        // if polygon is convex :

        // if no concavity is found then the polygon is convex
        if (first_concavity_vertex === null) {
            // so return the result of the convex polygon test
            // because the polygon is convex
            return in_convex_polygon({ x, y }, polygon);
        }

        // if polygon is concave :

        polygon = polygon.slice(); // copy the polygon

        // form a "concavity triangle"
        let vertex_index = first_concavity_vertex;
        // concavity triangle vertices
        let concavity = [
            polygon[looped_index(vertex_index + 1)],
            polygon[looped_index(vertex_index)],
            polygon[looped_index(vertex_index - 1)]
        ];

        // if point in "concavity triangle" returns false (outside)
        if (in_convex_polygon({ x, y }, concavity)) {
            // then the point is outside the polygon
            return false;
        }

        // form a new polygon with the concavity removed
        polygon.splice(vertex_index, 1);

        // go to the cycle beginning using the polygon
        // with the concavity removed as a polygon to test

    } // end of while(true)

} // end of in_concave_polygon({x,y},polygon)

// https://en.wikipedia.org/wiki/Point_in_polygon
function in_convex_polygon(px, polygon) { // px: a given point, p: a polygon (list of points)

    // polygon is a list of points

    // returns true if the point is inside the polygon
    // returns false if the point is outside the polygon

    // returns false if the polygon has less than 3 vertices
    if (polygon.length < 3)
        return false;

    // check if the point is on the left side of all the polygon edges
    const check = (p1, p2) => side(px, p1, p2) <= 0;

    // loop through all the edges of the polygon
    for (let point_index = 0; point_index < polygon.length; point_index++) {
        // if the point is on the left side of any edge
        // then the point is outside the polygon
        if (!check(polygon[point_index], polygon[(point_index + 1) % polygon.length]))
            // then the point is outside the polygon
            return false;
    }

    // if the point is on the right side of all the edges
    // then the point is inside the polygon
    return true;
}

// point px on which side of the line passing through p1 and p2 points
function side(px, p1, p2) {
    /*
    https://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line
    Use the sign of the determinant of vectors (AB,AM), where M(X,Y) is the query point:
    position = sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))
    It is 0 on the line, and +1 on one side, -1 on the other side.
    */
    // returns 0 if the point is on the line
    // returns +1 if the point is on the right side of the line
    // returns -1 if the point is on the left side of the line
    // returns 0 if the points are the same

    // get the coordinates of the points
    let Ax = p1.x, Ay = p1.y, Bx = p2.x, By = p2.y, X = px.x, Y = px.y;

    // return the sign of the determinant
    return Math.sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax));
}

function bounds_of_polygon(polygon_points) {

    // polygon_points is a list of points

    // returns the bounding box of the polygon
    // returns an object with x_min, y_min, x_max, y_max

    // if the polygon is empty returns undefined
    if (polygon_points.length < 1)
        return undefined;

    // initialize the bounding box
    let [x_min, x_max, y_min, y_max] = [
        polygon_points[0].x,
        polygon_points[0].y,
        polygon_points[0].x,
        polygon_points[0].y
    ];

    // find the bounding box
    for (const point of polygon_points) {
        x_min = Math.min(x_min, point.x);
        x_max = Math.max(x_max, point.x);
        y_min = Math.min(y_min, point.y);
        y_max = Math.max(y_max, point.y);
    }

    // return the bounding boxs
    return { x_min, y_min, x_max, y_max };
}