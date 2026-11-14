"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PecaTabuleiro3D() {
  const conteinerRef = useRef(null);

  useEffect(() => {
    if (!conteinerRef.current) return;

    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, -1, 0);

    const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setPixelRatio(window.devicePixelRatio);
    conteinerRef.current.appendChild(renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xfff5e6, 0.7);
    cena.add(luzAmbiente);
    const luzDirecional = new THREE.DirectionalLight(0xffeedd, 1.4);
    luzDirecional.position.set(5, 15, 10);
    cena.add(luzDirecional);

    const grupoTabuleiro = new THREE.Group();
    cena.add(grupoTabuleiro);

    const tamanhoCasa = 2;
    const corClara = 0xd4a373;
    const corEscura = 0x3e2312;

    for (let linha = 0; linha < 8; linha++) {
      for (let coluna = 0; coluna < 8; coluna++) {
        const ehClara = (linha + coluna) % 2 === 0;
        const geometriaCasa = new THREE.BoxGeometry(tamanhoCasa, 0.4, tamanhoCasa);
        const materialCasa = new THREE.MeshStandardMaterial({
          color: ehClara ? corClara : corEscura,
          roughness: 0.9,
        });
        const casa = new THREE.Mesh(geometriaCasa, materialCasa);

        casa.position.x = (coluna - 3.5) * tamanhoCasa;
        casa.position.z = (linha - 3.5) * tamanhoCasa;
        casa.position.y = -0.2;
        
        grupoTabuleiro.add(casa);
      }
    }

    function criarPeca(cor, x, z, deitada = false) {
      const grupoPeca = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({ 
        color: cor, 
        roughness: 0.3, 
        metalness: 0.15 
      });
      
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.3, 16), material);
      base.position.y = 0.15;
      grupoPeca.add(base);

      const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.8, 16), material);
      corpo.position.y = 1.2;
      grupoPeca.add(corpo);

      const cabeca = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
      cabeca.position.y = 2.3;
      grupoPeca.add(cabeca);

      grupoPeca.position.set(x * tamanhoCasa, 0, z * tamanhoCasa);

      if (deitada) {
        grupoPeca.rotation.x = Math.PI / 2.2;
        grupoPeca.position.y = 0.5;
        grupoPeca.position.z -= 0.5;
      }

      grupoTabuleiro.add(grupoPeca);
    }

    for (let coluna = -3.5; coluna <= 3.5; coluna++) {
      criarPeca(corEscura, coluna, -3.5);
      criarPeca(corEscura, coluna, -2.5);
      
      criarPeca(corClara, coluna, 2.5);
      if (coluna !== 3.5) {
        criarPeca(corClara, coluna, 3.5);
      }
    }
    criarPeca(corClara, 3.5, 3.5, true);

    grupoTabuleiro.scale.set(1.6, 1.6, 1.6);
    grupoTabuleiro.position.set(0, -4, 0);

    function animar() {
      requestAnimationFrame(animar);
      grupoTabuleiro.rotation.y += 0.001;
      renderizador.render(cena, camera);
    }
    animar();

    function redimensionar() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderizador.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", redimensionar);

    return () => {
      window.removeEventListener("resize", redimensionar);
      if (conteinerRef.current && renderizador.domElement) {
        conteinerRef.current.removeChild(renderizador.domElement);
      }
      renderizador.dispose();
    };
  }, []);

  return <div className="fundo-3d-global" ref={conteinerRef}></div>;
}