"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PecaTabuleiro3D() {
  const areaRef = useRef(null);
  const pecaRef = useRef(null);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.4, 5);

    const renderizador = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderizador.setSize(180, 180);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    area.appendChild(renderizador.domElement);

    const peca = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.4,
      roughness: 0.3,
    });

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.6, 0.18, 32),
      material,
    );
    base.position.y = 0.12;

    const corpo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.32, 0.85, 32),
      material,
    );
    corpo.position.y = 0.62;

    const topo = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 32, 32),
      material,
    );
    topo.position.y = 1.2;

    peca.add(base, corpo, topo);
    cena.add(peca);
    pecaRef.current = peca;

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 1.5);
    const luzDirecional = new THREE.DirectionalLight(0xffffff, 2);
    luzDirecional.position.set(3, 4, 5);
    cena.add(luzAmbiente, luzDirecional);

    let quadro;
    function animar() {
      quadro = requestAnimationFrame(animar);
      peca.rotation.y += 0.01;
      renderizador.render(cena, camera);
    }
    animar();

    return () => {
      cancelAnimationFrame(quadro);
      renderizador.dispose();
      base.geometry.dispose();
      corpo.geometry.dispose();
      topo.geometry.dispose();
      material.dispose();
      area.removeChild(renderizador.domElement);
      pecaRef.current = null;
    };
  }, []);

  function girarPeca(evento) {
    if (!pecaRef.current) return;

    const limites = evento.currentTarget.getBoundingClientRect();
    const posicaoX = (evento.clientX - limites.left) / limites.width;
    const posicaoY = (evento.clientY - limites.top) / limites.height;

    pecaRef.current.rotation.y = (posicaoX - 0.5) * 1.5;
    pecaRef.current.rotation.x = (posicaoY - 0.5) * 0.5;
  }

  return (
    <div
      ref={areaRef}
      className="peca-tabuleiro-3d"
      onPointerMove={girarPeca}
      aria-label="Peão de xadrez 3D dourado"
      role="img"
    />
  );
}
