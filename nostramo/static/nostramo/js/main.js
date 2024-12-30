import ThreeGlobe from 'https://esm.sh/three-globe?external=three';
import * as THREE from 'https://esm.sh/three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js?external=three';

// Gen random data
const N = 300;
const gData = [...Array(N).keys()].map(() => ({
	lat: (Math.random() - 0.5) * 180,
	lng: (Math.random() - 0.5) * 360,
	size: Math.random() / 3,
	color: ['#d2f8c7', '#caf5ca', '#d8edcc', '#abe3c5'][Math.round(Math.random() * 3)]
}));


fetch('../static/nostramo/js/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
{
	const Globe = new ThreeGlobe()
		.globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonUseDots(true)
        .hexPolygonColor(() => `#EA3F61`)
		.pointsData(gData)
		.pointAltitude('size')
		.pointColor('color');

	// Setup renderer
	const renderer = new THREE.WebGLRenderer( { alpha: true });
	renderer.setAnimationLoop( animate );
	const container = document.getElementById('globeViz');
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );

	// Setup scene
	const scene = new THREE.Scene();
	scene.add(Globe);
	scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
	scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

	// Setup camera
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.aspect = 1/1;
	camera.updateProjectionMatrix();
	camera.position.z = 200;

	// Kick-off renderer
	function animate() { // IIFE
		// Frame cycle
		Globe.rotation.x += 0.01;
		Globe.rotation.y += 0.01;
		renderer.render(scene, camera);
	}
});
