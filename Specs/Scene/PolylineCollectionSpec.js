/*global defineSuite*/
defineSuite([
         'Scene/PolylineCollection',
         'Scene/Polyline',
         '../Specs/createContext',
         '../Specs/destroyContext',
         '../Specs/sceneState',
         '../Specs/pick',
         'Core/Cartesian3',
         'Core/Matrix4',
         'Core/Math',
         'Renderer/BufferUsage'
     ], function(
         PolylineCollection,
         Polyline,
         createContext,
         destroyContext,
         sceneState,
         pick,
         Cartesian3,
         Matrix4,
         CesiumMath,
         BufferUsage) {
    "use strict";
    /*global it,expect,beforeEach,afterEach*/

    var context;
    var polylines;
    var us;

    beforeEach(function() {
        context = createContext();
        polylines = new PolylineCollection();

        var camera = {
            eye : new Cartesian3(-1.0, 0.0, 0.0),
            target : Cartesian3.ZERO,
            up : Cartesian3.UNIT_Z
        };
        us = context.getUniformState();
        us.setView(Matrix4.createLookAt(camera.eye, camera.target, camera.up));
        us.setProjection(Matrix4.createPerspectiveFieldOfView(CesiumMath.toRadians(60.0), 1.0, 0.01, 10.0));
    });

    afterEach(function() {
        us = null;
        destroyContext(context);
    });

    it("default constructs a polyline", function() {
        var p = polylines.add();
        expect(p.getShow()).toEqual(true);
        expect(p.getPositions().length).toEqual(0);
        expect(p.getColor().red).toEqual(1.0);
        expect(p.getColor().green).toEqual(1.0);
        expect(p.getColor().blue).toEqual(1.0);
        expect(p.getColor().alpha).toEqual(1.0);
        expect(p.getOutlineColor().red).toEqual(1.0);
        expect(p.getOutlineColor().green).toEqual(1.0);
        expect(p.getOutlineColor().blue).toEqual(1.0);
        expect(p.getOutlineColor().alpha).toEqual(1.0);
        expect(p.getWidth()).toEqual(1.0);
        expect(p.getOutlineWidth()).toEqual(1.0);

    });

    it("explicitly constructs a polyline", function() {
        var p = polylines.add({
            show : false,
            positions : [new Cartesian3(1.0, 2.0, 3.0), new Cartesian3(4.0, 5.0, 6.0)],
            width : 2,
            outlineWidth : 5,
            color : {
                red : 1.0,
                green : 2.0,
                blue : 3.0,
                alpha : 4.0
            },
            outlineColor: {
                red : 6.0,
                green : 7.0,
                blue : 8.0,
                alpha : 9.0
            }
        });

        expect(p.getShow()).toEqual(false);
        expect(p.getPositions()[0].equals(new Cartesian3(1.0, 2.0, 3.0))).toEqual(true);
        expect(p.getPositions()[1].equals(new Cartesian3(4.0, 5.0, 6.0))).toEqual(true);
        expect(p.getColor().red).toEqual(1.0);
        expect(p.getColor().green).toEqual(2.0);
        expect(p.getColor().blue).toEqual(3.0);
        expect(p.getColor().alpha).toEqual(4.0);
        expect(p.getWidth()).toEqual(2);
        expect(p.getOutlineWidth()).toEqual(5);
        expect(p.getOutlineColor().red).toEqual(6.0);
        expect(p.getOutlineColor().green).toEqual(7.0);
        expect(p.getOutlineColor().blue).toEqual(8.0);
        expect(p.getOutlineColor().alpha).toEqual(9.0);
    });

    it("set's a polyline's properties", function() {
        var p = polylines.add();
        p.setShow(false);
        p.setPositions([new Cartesian3(1.0, 2.0, 3.0), new Cartesian3(4.0, 5.0, 6.0)]);
        p.setColor({
            red : 1.0,
            green : 2.0,
            blue : 3.0,
            alpha : 4.0
        });
        p.setOutlineColor({
            red : 5.0,
            green : 6.0,
            blue : 7.0,
            alpha : 8.0
        });
        p.setWidth(2);
        p.setOutlineWidth(7);

        expect(p.getShow()).toEqual(false);
        expect(p.getPositions()[0].equals(new Cartesian3(1.0, 2.0, 3.0))).toEqual(true);
        expect(p.getPositions()[1].equals(new Cartesian3(4.0, 5.0, 6.0))).toEqual(true);
        expect(p.getColor().red).toEqual(1.0);
        expect(p.getColor().green).toEqual(2.0);
        expect(p.getColor().blue).toEqual(3.0);
        expect(p.getColor().alpha).toEqual(4.0);
        expect(p.getWidth()).toEqual(2);
        expect(p.getOutlineWidth()).toEqual(7);
        expect(p.getOutlineColor().red).toEqual(5.0);
        expect(p.getOutlineColor().green).toEqual(6.0);
        expect(p.getOutlineColor().blue).toEqual(7.0);
        expect(p.getOutlineColor().alpha).toEqual(8.0);
    });

    it("set's a removed polyline's property", function() {
        var p = polylines.add();
        polylines.remove(p);
        p.setShow(false);
        expect(p.getShow()).toEqual(false);
    });

    it("has zero polylines when constructed", function() {
        expect(polylines.getLength()).toEqual(0);
    });

    it("adds a polyline", function() {
        var p = polylines.add({
            positions : [{
                x : 1.0,
                y : 2.0,
                z : 3.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });

        expect(polylines.getLength()).toEqual(1);
        expect(polylines.get(0).equals(p)).toEqual(true);
    });

    it("removes the first polyline", function() {
        var one = polylines.add({
            positions : [{
                x : 1.0,
                y : 2.0,
                z : 3.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        var two = polylines.add({
            positions : [{
                x : 4.0,
                y : 5.0,
                z : 6.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });

        expect(polylines.getLength()).toEqual(2);

        expect(polylines.remove(one)).toEqual(true);

        expect(polylines.getLength()).toEqual(1);
        expect(polylines.get(0).equals(two)).toEqual(true);
    });

    it("removes the last polyline", function() {
        var one = polylines.add({
            positions : [{
                x : 1.0,
                y : 2.0,
                z : 3.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        var two = polylines.add({
            positions : [{
                x : 4.0,
                y : 5.0,
                z : 6.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });

        expect(polylines.getLength()).toEqual(2);

        expect(polylines.remove(two)).toEqual(true);

        expect(polylines.getLength()).toEqual(1);
        expect(polylines.get(0).equals(one)).toEqual(true);
    });

    it("removes the same polyline twice", function() {
        var p = polylines.add({
            positions : [{
                x : 1.0,
                y : 2.0,
                z : 3.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        expect(polylines.getLength()).toEqual(1);

        expect(polylines.remove(p)).toEqual(true);
        expect(polylines.getLength()).toEqual(0);

        expect(polylines.remove(p)).toEqual(false);
        expect(polylines.getLength()).toEqual(0);
    });

    it("removes null", function() {
        polylines.add({
            positions : [{
                x : 1.0,
                y : 2.0,
                z : 3.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        expect(polylines.getLength()).toEqual(1);

        expect(polylines.remove(null)).toEqual(false);
        expect(polylines.getLength()).toEqual(1);
    });

    it("adds and removes polylines", function() {
        var one = polylines.add({
            positions : [{
                x : 1.0,
                y : 2.0,
                z : 3.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        var two = polylines.add({
            positions : [{
                x : 4.0,
                y : 5.0,
                z : 6.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        expect(polylines.getLength()).toEqual(2);
        expect(polylines.get(0).equals(one)).toEqual(true);
        expect(polylines.get(1).equals(two)).toEqual(true);

        expect(polylines.remove(two)).toEqual(true);
        var three = polylines.add({
            positions : [{
                x : 7.0,
                y : 8.0,
                z : 9.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        expect(polylines.getLength()).toEqual(2);
        expect(polylines.get(0).equals(one)).toEqual(true);
        expect(polylines.get(1).equals(three)).toEqual(true);
    });

    it("removes all polylines", function() {
        polylines.add({
            positions : [{
                x : 1.0,
                y : 2.0,
                z : 3.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        polylines.add({
            positions : [{
                x : 4.0,
                y : 5.0,
                z : 6.0
            },{
                x : 2.0,
                y : 3.0,
                z : 4.0
            }]
        });
        expect(polylines.getLength()).toEqual(2);

        polylines.removeAll();
        expect(polylines.getLength()).toEqual(0);
    });

    it("contains a polyline", function() {
        var p = polylines.add();
        polylines.add(p);

        expect(polylines.contains(p)).toEqual(true);
    });

    it("doesn't contain a polyline", function() {
        var p0 = polylines.add();
        var p1 = polylines.add();

        polylines.add(p0);
        polylines.add(p1);
        polylines.remove(p0);

        expect(polylines.contains(p0)).toEqual(false);
    });

    it("doesn't contain undefined", function() {
        expect(polylines.contains()).toBeFalsy();
    });

});