import assert from 'assert';
import { GUI } from '../dist/lil-gui.esm.min.js';

export default () => {

	const gui = new GUI();
	const obj = { number: 1 };

	// Should create a logarithmic slider
	let controller = gui.add( obj, 'number', 1, 1000, 1, 'logarithmic' );
	assert.strictEqual( controller._scale, 'logarithmic', 'should enable logarithmic scale' );

	// Should fall back to linear scale when min <= 0
	controller = gui.add( obj, 'number', 0, 1000, 1, 'logarithmic' );
	assert.strictEqual( controller._scale, 'linear', 'should fall back to linear scale when min is 0' );

	controller = gui.add( obj, 'number', -10, 1000, 1, 'logarithmic' );
	assert.strictEqual( controller._scale, 'linear', 'should fall back to linear scale when min is negative' );

	// Should fall back to linear scale when max <= 0
	controller = gui.add( obj, 'number', 1, 0, 1, 'logarithmic' );
	assert.strictEqual( controller._scale, 'linear', 'should fall back to linear scale when max is 0' );

	controller = gui.add( obj, 'number', 1, -10, 1, 'logarithmic' );
	assert.strictEqual( controller._scale, 'linear', 'should fall back to linear scale when max is negative' );

	// Should map slider position to logarithmic value
	controller = gui.add( obj, 'number', 1, 1000, 0.1, 'logarithmic' );
	const value = controller._mapLogTo( 0.5, 1, 1000, 0, 1 );
	assert.ok( Math.abs( value - Math.sqrt( 1000 ) ) < 0.1, 'should map slider position to logarithmic value' );

	// Should map logarithmic value to slider position
	const position = controller._mapLogFrom( Math.sqrt( 1000 ), 1, 1000, 0, 1 );
	assert.ok( Math.abs( position - 0.5 ) < 0.01, 'should map logarithmic value to slider position' );

	// Should update display with logarithmic value
	obj.number = Math.sqrt( 1000 );
	controller.updateDisplay();
	assert.strictEqual( controller.$fill.style.width, '50%', 'should update display with correct width' );

	// Should handle mouse interaction
	const rect = controller.$slider.getBoundingClientRect();
	const x = rect.left + rect.width * 0.5;
	controller.$slider.$callEventListener( 'mousedown', { clientX: x } );
	assert.ok( Math.abs( obj.number - Math.sqrt( 1000 ) ) < 0.1, 'should set correct value on mouse interaction' );

	gui.destroy();

};
