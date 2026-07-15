import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

class MockVector3 {
  x = 0; y = 0; z = 0;
  constructor(x=0,y=0,z=0) { this.x=x; this.y=y; this.z=z; }
  set() { return this; }
  copy() { return this; }
  lerp() { return this; }
  clone() { return new MockVector3(); }
  sub() { return this; }
  normalize() { return this; }
  distanceTo() { return 1; }
}

// Mock THREE to prevent WebGL errors in jsdom
vi.mock('three', () => {
  class MockWebGLRenderer {
    setSize() {}
    setAnimationLoop() {}
    dispose() {}
    setPixelRatio() {}
    render() {}
    domElement = document.createElement('canvas');
  }
  return {
    Scene: class { add() {} },
    PerspectiveCamera: class { position = new MockVector3(); lookAt() {} },
    OrthographicCamera: class { position = new MockVector3(); lookAt() {} },
    WebGLRenderer: MockWebGLRenderer,
    BoxGeometry: class {},
    PlaneGeometry: class {},
    SphereGeometry: class {},
    CylinderGeometry: class {},
    BufferGeometry: class { setAttribute() {} },
    ShaderMaterial: class {},
    MeshBasicMaterial: class {},
    MeshStandardMaterial: class {},
    MeshPhongMaterial: class {},
    PointsMaterial: class {},
    Points: class { rotation = { x: 0, y: 0 }; },
    Mesh: class { position: any; scale: any; rotation: any; quaternion: any; material: any; constructor() { this.position = new MockVector3(); this.scale = new MockVector3(); this.rotation = { x: 0, y: 0 }; this.quaternion = { setFromUnitVectors: () => {} }; this.material = { uniforms: {} }; } lookAt() {} },
    EdgesGeometry: class {},
    LineBasicMaterial: class {},
    LineSegments: class { rotation = { x: 0, y: 0 }; },
    Color: class {},
    Vector2: class {},
    Vector3: MockVector3,
    Group: class { position: any; rotation: any; quaternion: any; constructor() { this.position = new MockVector3(); this.rotation = { x: 0, y: 0 }; this.quaternion = { setFromUnitVectors: () => {} }; } add() {} },
    AmbientLight: class { position = new MockVector3(); },
    DirectionalLight: class { position = new MockVector3(); },
    PointLight: class { position = new MockVector3(); },
    MathUtils: { degToRad: () => 1 },
    BufferAttribute: class {},
    AdditiveBlending: 2,
  };
});

// Mock Freighter API & Wallets Kit to prevent ESM export errors
vi.mock('@stellar/freighter-api', () => ({
  getAddress: vi.fn(),
  signTransaction: vi.fn(),
  isConnected: vi.fn(),
}));

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: class {
    constructor() {}
    getPublicKey = vi.fn();
  },
  Networks: { TESTNET: 'TESTNET' },
}));

