import ThreeGlobe from 'https://esm.sh/three-globe?external=three';
import * as THREE from 'https://esm.sh/three';

function getCityFeatures() {
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
			const minPopulation = 1;
			
			const logMaxPop = 20;
			const logMinPop = 9;
            //const maxPopulation = Math.max(...data.map(row => parseInt(row[9]) || 1));

			const N = 1000;
			const gData = [];

            while (gData.length < N) {
                const randomCity = data[Math.floor(Math.random() * data.length)];

                const lat = Number(randomCity[2]);
                const lng = Number(randomCity[3]);
                const population = Number(randomCity[9]);
				const logPop = Math.log(population);
				const normalizedSize = (logPop - logMinPop) / (logMaxPop - logMinPop);

				const cityData = {
					lat: lat,
					lng: lng,
					size: normalizedSize,
					color: ['#d2f8c7', '#caf5ca', '#d8edcc', '#abe3c5'][Math.round(Math.random() * 3)]
				};

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

async function getRippleData() {
	const N = 10;
	const gData = [...Array(N).keys()].map(() => ({
		lat: (Math.random() - 0.5) * 180,
		lng: (Math.random() - 0.5) * 360,
		maxR: Math.random() * 20 + 3,
		propagationSpeed: (Math.random()) * 2 + 1,
		repeatPeriod: Math.random() * 2000 + 200
	}));
	return gData;
}

async function initializeGlobe() {

	const countryFeatures = await getCountryFeatures();
	const cityFeatures = await getCityFeatures();
	const rippleData = await getRippleData();
	const colorInterpolator = t => `rgba(255,100,50,${1-t})`;
	const texture = new THREE.TextureLoader().load('../static/nostramo/images/HexagonTile_DIFF.png', (texture) => {
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(10,10);
		//globeMaterial.specularMap = texture;
		//globeMaterial.specular = new THREE.Color('grey');
		//globeMaterial.shininess = 15;

	});
	const globeMaterial = new THREE.MeshBasicMaterial({
		map: texture,
	});

	const Globe = new ThreeGlobe()
	.globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
	.bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
	//.globeMaterial(globeMaterial)
	.hexPolygonsData(countryFeatures)
	.hexPolygonResolution(2)
	.hexPolygonMargin(0.1)
	.hexPolygonColor(() => `#EA3F61`)
	.pointsData(cityFeatures)
	.pointAltitude('size')
	.pointColor('color')
	.ringsData(rippleData)
	.ringColor(() => colorInterpolator)
	.ringMaxRadius('maxR')
	.ringPropagationSpeed('propagationSpeed')
	.ringRepeatPeriod('repeatPeriod')

	const renderer = new THREE.WebGLRenderer( { alpha: true });
	const container = document.getElementById('globeViz');
	window.addEventListener('resize', () => {
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);
	//renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );

	const scene = new THREE.Scene();
	scene.add(Globe);
	scene.add(new THREE.AmbientLight(0xCCCCCC, Math.PI));
	scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

	const camera = new THREE.PerspectiveCamera( 75, container.innerWidthGG / container.innerHeight, 0.1, 1000 );
	camera.aspect = 1/1;
	camera.updateProjectionMatrix();
	camera.position.z = 250;

	function animate() { // IIFE
		// Frame cycle
		const rotX = 0.005;
		const rotY = 0.005;
		Globe.rotation.x += rotX;
		Globe.rotation.y += rotY;
		renderer.render(scene, camera);
	}

	renderer.setAnimationLoop( animate );
}

initializeGlobe();
