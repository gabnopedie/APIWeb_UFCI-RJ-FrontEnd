"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Reflector } from "three/addons/objects/Reflector.js";

function materialTitaneo(nome, materialOriginal) {
  const material = materialOriginal.clone();

  if (nome === "border") {
    material.color.set("#3f291b");
    material.metalness = 0.42;
    material.roughness = 0.3;
    material.clearcoat = 0.45;
  } else if (nome === "stringing") {
    material.color.set("#9e7954");
    material.metalness = 0.6;
    material.roughness = 0.28;
    material.clearcoat = 0.35;
  } else if (nome === "squares_light") {
    material.color.set("#bca27e");
    material.metalness = 0.14;
    material.roughness = 0.37;
    material.clearcoat = 0.24;
  } else if (nome === "squares_dark") {
    material.color.set("#493322");
    material.metalness = 0.26;
    material.roughness = 0.35;
    material.clearcoat = 0.34;
  } else if (nome.endsWith("_felt")) {
    material.color.set("#35261d");
    material.metalness = 0.08;
    material.roughness = 0.78;
  } else if (nome.startsWith("white_")) {
    material.color.set("#e0d1b8");
    material.metalness = 0.82;
    material.roughness = 0.2;
    material.clearcoat = 0.72;
  } else if (nome.startsWith("black_")) {
    material.color.set("#50463d");
    material.metalness = 0.9;
    material.roughness = 0.18;
    material.clearcoat = 0.8;
  }

  material.envMapIntensity = nome.startsWith("white_") || nome.startsWith("black_")
    ? 1.5
    : 0.75;
  return material;
}

function criarReflexoTabuleiro(cenaModelo) {
  const casasClaras = cenaModelo.getObjectByName("squares_light");
  if (!casasClaras) return null;

  const limites = new THREE.Box3().setFromObject(casasClaras);
  const tamanho = limites.getSize(new THREE.Vector3());
  const shaderReflexo = {
    ...Reflector.ReflectorShader,
    uniforms: {
      ...Reflector.ReflectorShader.uniforms,
      opacity: { value: 0.14 },
    },
    fragmentShader: Reflector.ReflectorShader.fragmentShader
      .replace(
        "uniform vec3 color;",
        "uniform vec3 color;\n\t\tuniform float opacity;"
      )
      .replace(
        "gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );",
        "gl_FragColor = vec4( blendOverlay( base.rgb, color ), opacity );"
      ),
  };
  const espelho = new Reflector(
    new THREE.PlaneGeometry(tamanho.x, tamanho.z),
    {
      color: 0x806344,
      textureWidth: 512,
      textureHeight: 512,
      multisample: 0,
      clipBias: 0.002,
      shader: shaderReflexo,
    }
  );

  espelho.rotation.x = -Math.PI / 2;
  espelho.position.set(0, limites.max.y + 0.00015, 0);
  espelho.material.transparent = true;
  espelho.material.depthWrite = false;
  espelho.renderOrder = 1;
  cenaModelo.add(espelho);

  return espelho;
}

function liberarObjeto(objeto) {
  objeto.traverse((item) => {
    if (!item.isMesh) return;
    item.geometry.dispose();
    const materiais = Array.isArray(item.material)
      ? item.material
      : [item.material];
    materiais.forEach((material) => material.dispose());
  });
}

export default function PecaTabuleiro3D() {
  const conteinerRef = useRef(null);
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const conteiner = conteinerRef.current;
    if (!conteiner) return;

    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 10, 24);
    camera.lookAt(0, 0, 0);

    const renderizador = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.outputColorSpace = THREE.SRGBColorSpace;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 0.96;
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.VSMShadowMap;
    conteiner.appendChild(renderizador.domElement);

    const ambiente = new RoomEnvironment();
    const geradorAmbiente = new THREE.PMREMGenerator(renderizador);
    const texturaAmbiente = geradorAmbiente.fromScene(ambiente).texture;
    cena.environment = texturaAmbiente;
    cena.environmentIntensity = 0.8;
    geradorAmbiente.dispose();

    cena.add(new THREE.HemisphereLight(0xffead7, 0x251810, 1.1));

    const luzPrincipal = new THREE.DirectionalLight(0xffdfbd, 2.6);
    luzPrincipal.position.set(-7, 12, 8);
    luzPrincipal.castShadow = true;
    luzPrincipal.shadow.mapSize.set(1024, 1024);
    luzPrincipal.shadow.camera.left = -14;
    luzPrincipal.shadow.camera.right = 14;
    luzPrincipal.shadow.camera.top = 14;
    luzPrincipal.shadow.camera.bottom = -14;
    luzPrincipal.shadow.camera.far = 100;
    luzPrincipal.shadow.bias = -0.0002;
    luzPrincipal.shadow.normalBias = 0.02;
    luzPrincipal.shadow.blurSamples = 10;
    cena.add(luzPrincipal);

    const luzRecorte = new THREE.DirectionalLight(0xd8c6ae, 1.4);
    luzRecorte.position.set(8, 5, -10);
    cena.add(luzRecorte);

    const grupoTabuleiro = new THREE.Group();
    cena.add(grupoTabuleiro);

    let quadroAnimacao;
    let modeloCarregado = false;
    let tamanhoOriginal = 0;
    let escalaBase = 1;
    let alvoEscala = 1;
    let alvoInclinacaoX = 0;
    let alvoInclinacaoZ = 0;
    let espelhoTabuleiro = null;
    let ultimoTempo = 0;
    let alvoLuzX = -7;
    let alvoLuzZ = 8;
    let alvoBrilho = 2.6;
    let brilhoAtual = 2.6;
    let alvoAmbiente = 0.8;
    let ambienteAtual = 0.8;
    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function ajustarTamanho() {
      const largura = window.innerWidth;
      const altura = window.innerHeight;
      camera.aspect = largura / altura;
      camera.updateProjectionMatrix();
      renderizador.setSize(largura, altura);

      if (modeloCarregado) {
        const distancia = camera.position.length();
        const alturaVisivel =
          2 *
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
          distancia;
        const larguraVisivel = alturaVisivel * camera.aspect;
        const tamanhoAlvo = Math.min(
          alturaVisivel * 1.12,
          larguraVisivel * (largura < 768 ? 0.9 : 1.08)
        );
        escalaBase = tamanhoAlvo / tamanhoOriginal;
        alvoEscala = pathnameRef.current === "/" ? escalaBase : escalaBase * 1.16;
        grupoTabuleiro.scale.setScalar(alvoEscala);
      }
    }

    function moverTabuleiro(evento) {
      const eixoX = (evento.clientX / window.innerWidth) * 2 - 1;
      const eixoY = (evento.clientY / window.innerHeight) * 2 - 1;
      alvoInclinacaoZ = eixoX * 0.075;
      alvoInclinacaoX = eixoY * -0.055;
      alvoLuzX = eixoX * 11;
      alvoLuzZ = 8 - eixoY * 7;
      alvoBrilho = 3.5;
      alvoAmbiente = 1.05;
    }

    function estabilizarTabuleiro() {
      alvoInclinacaoX = 0;
      alvoInclinacaoZ = 0;
      alvoLuzX = -7;
      alvoLuzZ = 8;
      alvoBrilho = 2.6;
      alvoAmbiente = 0.8;
    }

    function animar(tempoAtual) {
      quadroAnimacao = window.requestAnimationFrame(animar);
      const delta = ultimoTempo
        ? Math.min((tempoAtual - ultimoTempo) / 1000, 0.05)
        : 0;
      ultimoTempo = tempoAtual;
      if (!movimentoReduzido) grupoTabuleiro.rotation.y += delta * 0.012;
      const emModulo = pathnameRef.current !== "/";
      alvoEscala = escalaBase * (emModulo ? 1.16 : 1);
      const escalaAtual = grupoTabuleiro.scale.x;
      const escalaSuave = THREE.MathUtils.lerp(escalaAtual, alvoEscala, 0.025);
      grupoTabuleiro.scale.setScalar(escalaSuave);
      grupoTabuleiro.rotation.x = THREE.MathUtils.lerp(
        grupoTabuleiro.rotation.x,
        alvoInclinacaoX,
        0.04
      );
      grupoTabuleiro.rotation.z = THREE.MathUtils.lerp(
        grupoTabuleiro.rotation.z,
        alvoInclinacaoZ,
        0.04
      );
      luzPrincipal.position.x = THREE.MathUtils.lerp(
        luzPrincipal.position.x,
        alvoLuzX,
        0.04
      );
      luzPrincipal.position.z = THREE.MathUtils.lerp(
        luzPrincipal.position.z,
        alvoLuzZ,
        0.04
      );
      brilhoAtual = THREE.MathUtils.lerp(brilhoAtual, alvoBrilho, 0.045);
      luzPrincipal.intensity = brilhoAtual;
      ambienteAtual = THREE.MathUtils.lerp(ambienteAtual, alvoAmbiente, 0.035);
      cena.environmentIntensity = ambienteAtual;
      renderizador.render(cena, camera);
    }

    const carregador = new GLTFLoader();
    carregador.load(
      "/chess-set-spin.glb",
      (gltf) => {
        gltf.scene.traverse((item) => {
          if (!item.isMesh) return;
          item.material = Array.isArray(item.material)
            ? item.material.map((material) =>
                materialTitaneo(item.name, material)
              )
            : materialTitaneo(item.name, item.material);
          item.castShadow = true;
          item.receiveShadow = true;
        });

        const limites = new THREE.Box3().setFromObject(gltf.scene);
        const centro = limites.getCenter(new THREE.Vector3());
        const tamanho = limites.getSize(new THREE.Vector3());
        tamanhoOriginal = Math.max(tamanho.x, tamanho.y, tamanho.z);
        espelhoTabuleiro = criarReflexoTabuleiro(gltf.scene);
        gltf.scene.position.sub(centro);
        grupoTabuleiro.add(gltf.scene);
        modeloCarregado = true;
        ajustarTamanho();
        animar();
      },
      undefined,
      (erro) => {
        console.error("Não foi possível carregar o modelo 3D do tabuleiro.", erro);
      }
    );

    window.addEventListener("resize", ajustarTamanho);
    window.addEventListener("pointermove", moverTabuleiro);
    window.addEventListener("pointerleave", estabilizarTabuleiro);

    return () => {
      window.cancelAnimationFrame(quadroAnimacao);
      window.removeEventListener("resize", ajustarTamanho);
      window.removeEventListener("pointermove", moverTabuleiro);
      window.removeEventListener("pointerleave", estabilizarTabuleiro);
      espelhoTabuleiro?.dispose();
      liberarObjeto(grupoTabuleiro);
      liberarObjeto(ambiente);
      texturaAmbiente.dispose();
      renderizador.dispose();
      if (conteiner.contains(renderizador.domElement)) {
        conteiner.removeChild(renderizador.domElement);
      }
    };
  }, []);

  return <div className="fundo-3d-global" ref={conteinerRef} aria-hidden="true" />;
}
