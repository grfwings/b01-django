import ThreeGlobe from 'https://esm.sh/three-globe?external=three';
import * as THREE from 'https://esm.sh/three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js?external=three';

function getCityFeatures(N) {
    return fetch('../static/nostramo/data/worldcities.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch CSV file');
            }
            return response.text();
        })
        .then(csvText => {
			const rows = csvText
			  .split("\n")
			  .map(row => row.split(",").map(cell => cell.replace(/"/g, "")));
            const data = rows.slice(1); // Data excluding header

			const maxPopulation = 40000000;
            //const maxPopulation = Math.max(...data.map(row => parseInt(row[9]) || 1));

			const gData = [];

            while (gData.length < N) {
                const randomCity = data[Math.floor(Math.random() * data.length)];

                // Get lat, lng, and population
                const lat = Number(randomCity[2]);
                const lng = Number(randomCity[3]);
                const population = Number(randomCity[9]);

                // Normalize size based on population
                const normalizedSize = population / maxPopulation;

				const cityData = {
					lat: lat,
					lng: lng,
					size: normalizedSize,
					color: ['#d2f8c7', '#caf5ca', '#d8edcc', '#abe3c5'][Math.round(Math.random() * 3)]
				}

				gData.push(cityData);
            }
			return gData;
        })
        .catch(error => {
            console.error('Error fetching or processing CSV:', error);
			return [];
        });
}

async function getCountryFeatures() {
	return fetch('../static/nostramo/data/ne_110m_admin_0_countries.geojson')
		.then(res => res.json())
		.then(countries => {
			return countries.features;
		})
		.catch(error => {
			console.error('Error loading country features:', error);
			return [];
		})
}

async function initializeGlobe() {

	const countryFeatures = await getCountryFeatures();
	const cityFeatures = await getCityFeatures(500);
	console.log(cityFeatures);

	// Gen random data
	const N = 100;
	const gData = [...Array(N).keys()].map(() => ({
		lat: (Math.random() - 0.5) * 180,
		lng: (Math.random() - 0.5) * 360,
		size: Math.random() / 3,
		color: ['#d2f8c7', '#caf5ca', '#d8edcc', '#abe3c5'][Math.round(Math.random() * 3)]
	}));
	console.log(gData);
	
	const Globe = new ThreeGlobe()
		.globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
		.hexPolygonsData(countryFeatures)
		.hexPolygonResolution(3)
		.hexPolygonMargin(0.3)
		.hexPolygonUseDots(true)
		.hexPolygonColor(() => `#EA3F61`)
		.pointsData(cityFeatures)
		.pointAltitude('size')
		.pointColor('color');
	
	const renderer = new THREE.WebGLRenderer( { alpha: true });
	const container = document.getElementById('globeViz');
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );
	
	const scene = new THREE.Scene();
	scene.add(Globe);
	scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
	scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));
	
	const camera = new THREE.PerspectiveCamera( 75, container.innerWidth / container.innerHeight, 0.1, 1000 );
	camera.aspect = 1/1;
	camera.updateProjectionMatrix();
	camera.position.z = 200;

	function animate() { // IIFE
		// Frame cycle
		Globe.rotation.x += 0.01;
		Globe.rotation.y += 0.01;
		renderer.render(scene, camera);
	}

	renderer.setAnimationLoop( animate );
}

initializeGlobe();
