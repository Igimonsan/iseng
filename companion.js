// https://github.com/Manas-Kenge/companion.js

(function followerVariants() {
  const isReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)") === true ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;

  if (isReducedMotion) return;

  const scriptEl = document.currentScript;
  const normalizeVariant = (value) =>
    (value || "shinobi")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const defaultBehavior = {
    speed: 9.5,
    displayHeight: 80,
    idleDistance: 54,
    deathIntervalSeconds: 42,
    deathDurationFrames: 75,
  };

  const variantCatalog = [
    {
      key: "shinobi",
      displayName: "Shinobi",
      storageKey: "shinobi",
      basePath: "./Assets/Shinobi",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Attack_3.png",
        dead: "Dead.png",
      },
    },
    {
      key: "samurai",
      displayName: "Samurai",
      storageKey: "samurai",
      basePath: "./Assets/Samurai",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Attack_2.png",
        dead: "Dead.png",
      },
    },
    {
      key: "fighter",
      displayName: "Fighter",
      storageKey: "fighter",
      basePath: "./Assets/Fighter",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Attack_3.png",
        dead: "Dead.png",
      },
    },
    {
      key: "fire-wizard",
      displayName: "Fire Wizard",
      storageKey: "fire-wizard",
      basePath: "./Assets/Fire Wizard",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Flame_jet.png",
        dead: "Dead.png",
      },
    },
    {
      key: "lightning-mage",
      displayName: "Lightning Mage",
      storageKey: "lightning-mage",
      basePath: "./Assets/Lightning Mage",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Light_charge.png",
        dead: "Dead.png",
      },
    },
    {
      key: "wanderer-magician",
      displayName: "Wanderer Magician",
      storageKey: "wanderer-magician",
      basePath: "./Assets/Wanderer Magican",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Attack_1.png",
        dead: "Dead.png",
      },
    },
    {
      key: "knight-1",
      displayName: "Knight 1",
      storageKey: "knight-1",
      basePath: "./Assets/Knight_1",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Attack_1.png",
        dead: "Dead.png",
      },
    },
    {
      key: "knight-2",
      displayName: "Knight 2",
      storageKey: "knight-2",
      basePath: "./Assets/Knight_2",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Attack_1.png",
        dead: "Dead.png",
      },
    },
    {
      key: "knight-3",
      displayName: "Knight 3",
      storageKey: "knight-3",
      basePath: "./Assets/Knight_3",
      sprites: {
        idle: "Idle.png",
        run: "Run.png",
        attack: "Attack_1.png",
        dead: "Dead.png",
      },
    },
  ];

  const variants = Object.fromEntries(
    variantCatalog.map(({ key, behavior = {}, ...config }) => [
      key,
      {
        ...config,
        ...defaultBehavior,
        ...behavior,
        sprites: { ...config.sprites },
      },
    ])
  );

  window.followerVariantCatalog = variantCatalog;
  window.followerVariants = variants;

  const variantKey = normalizeVariant(scriptEl?.dataset?.variant);
  const selectedVariant = variants[variantKey];

  if (!selectedVariant) {
    const available = Object.keys(variants).join(", ");
    console.warn(
      `[follower-variants] Unknown variant "${variantKey}". Available variants: ${available}.`
    );
    return;
  }

  let persistPosition = true;
  let speed = selectedVariant.speed;
  let displayHeight = selectedVariant.displayHeight;
  let idleDistance = selectedVariant.idleDistance;
  let deathIntervalSeconds = selectedVariant.deathIntervalSeconds;
  let deathDurationFrames = selectedVariant.deathDurationFrames;
  const attackFrameDuration = 3;
  const deathFrameDuration = 4;
  const idleFrameDivider = 6;
  const runFrameDivider = 2;

  (function applyDatasetOverrides() {
    if (!scriptEl || !scriptEl.dataset) return;

    if (
      Object.prototype.hasOwnProperty.call(scriptEl.dataset, "persistPosition")
    ) {
      try {
        if (scriptEl.dataset.persistPosition === "") {
          persistPosition = true;
        } else {
          persistPosition = JSON.parse(
            scriptEl.dataset.persistPosition.toLowerCase()
          );
        }
      } catch (error) {
        console.warn(
          "[follower-variants] Invalid persistPosition value",
          error
        );
      }
    }

    if (scriptEl.dataset.height) {
      const parsedHeight = parseInt(scriptEl.dataset.height, 10);
      if (!Number.isNaN(parsedHeight) && parsedHeight > 0) {
        displayHeight = parsedHeight;
      }
    }

    if (scriptEl.dataset.speed) {
      const parsedSpeed = parseFloat(scriptEl.dataset.speed);
      if (!Number.isNaN(parsedSpeed) && parsedSpeed > 0) {
        speed = parsedSpeed;
      }
    }

    if (scriptEl.dataset.idleDistance) {
      const parsedIdle = parseFloat(scriptEl.dataset.idleDistance);
      if (!Number.isNaN(parsedIdle) && parsedIdle > 0) {
        idleDistance = parsedIdle;
      }
    }

    if (scriptEl.dataset.deathInterval) {
      const parsedInterval = parseFloat(scriptEl.dataset.deathInterval);
      if (!Number.isNaN(parsedInterval) && parsedInterval > 0) {
        deathIntervalSeconds = parsedInterval;
      }
    }

    if (scriptEl.dataset.deathDuration) {
      const parsedDuration = parseInt(scriptEl.dataset.deathDuration, 10);
      if (!Number.isNaN(parsedDuration) && parsedDuration > 0) {
        deathDurationFrames = parsedDuration;
      }
    }
  })();

  const storageKey = `follower-${selectedVariant.storageKey || variantKey}`;
  const basePath = selectedVariant.basePath.replace(/\/?$/, "/");

  const spriteSources = Object.entries(selectedVariant.sprites).reduce(
    (acc, [name, file]) => {
      acc[name] = basePath + file;
      return acc;
    },
    {}
  );

  const companionEl = document.createElement("div");
  let companionPosX = 64;
  let companionPosY = 64;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTimer = 0;
  let attackFrame = 0;
  let deathFrame = 0;
  let isAttacking = false;
  let isDead = false;
  let lastDeathTrigger = 0;
  let facingLeft = false;

  const sprites = {};
  let currentSpriteMeta = null;

  function encodePath(path) {
    return encodeURI(path);
  }

  function loadSprites() {
    const entries = Object.entries(spriteSources);
    const loaders = entries.map(([name, path]) => {
      return new Promise((resolve) => {
        const encoded = encodePath(path);
        const image = new Image();
        image.onload = function () {
          const frameHeight = image.height;
          const estimatedFrames = Math.max(
            1,
            Math.round(image.width / frameHeight)
          );
          const frameWidth = image.width / estimatedFrames;
          sprites[name] = {
            url: encoded,
            frames: estimatedFrames,
            frameWidth,
            frameHeight,
          };
          resolve();
        };
        image.onerror = function () {
          console.error(
            `[follower-variants] Failed to load sprite for ${name} at ${path}`
          );
          resolve();
        };
        image.src = encoded;
      });
    });

    return Promise.all(loaders);
  }

  function persistState() {
    if (!persistPosition) return;
    const payload = {
      companionPosX,
      companionPosY,
      frameCount,
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (error) {
      console.warn("[follower-variants] Unable to persist state", error);
    }
  }

  function restoreState() {
    if (!persistPosition) return;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      companionPosX = parsed.companionPosX ?? companionPosX;
      companionPosY = parsed.companionPosY ?? companionPosY;
      frameCount = parsed.frameCount ?? frameCount;
    } catch (error) {
      console.warn("[follower-variants] Failed to restore state", error);
    }
  }

  function updateElementPosition() {
    const width = currentSpriteMeta
      ? currentSpriteMeta.renderWidth
      : displayHeight;
    const height = currentSpriteMeta
      ? currentSpriteMeta.renderHeight
      : displayHeight;
    companionEl.style.left = `${companionPosX - width / 2}px`;
    companionEl.style.top = `${companionPosY - height / 2}px`;
  }

  function chooseSpriteName(requested) {
    if (sprites[requested]) return requested;
    if (requested === "attack") {
      if (sprites.run) return "run";
      if (sprites.idle) return "idle";
    }
    if (requested === "dead") {
      if (sprites.idle) return "idle";
      if (sprites.run) return "run";
    }
    if (requested === "run" && sprites.idle) {
      return "idle";
    }
    return Object.keys(sprites)[0];
  }

  function setSprite(name, frameIndex) {
    if (!Object.keys(sprites).length) return;
    const spriteName = chooseSpriteName(name);
    const sprite = sprites[spriteName];
    if (!sprite) return;

    const frame = frameIndex % sprite.frames;
    const scale = displayHeight / sprite.frameHeight;
    const renderWidth = sprite.frameWidth * scale;
    const renderHeight = sprite.frameHeight * scale;

    if (!currentSpriteMeta || currentSpriteMeta.name !== spriteName) {
      companionEl.style.backgroundImage = `url("${sprite.url}")`;
    }

    const totalWidth = sprite.frameWidth * sprite.frames * scale;
    companionEl.style.backgroundSize = `${totalWidth}px ${renderHeight}px`;
    companionEl.style.width = `${renderWidth}px`;
    companionEl.style.height = `${renderHeight}px`;
    companionEl.style.backgroundPosition = `${frame * -renderWidth}px 0px`;

    if (facingLeft) {
      companionEl.style.transform = "scaleX(-1)";
    } else {
      companionEl.style.transform = "scaleX(1)";
    }

    currentSpriteMeta = {
      name: spriteName,
      renderWidth,
      renderHeight,
      scale,
      frames: sprite.frames,
    };

    updateElementPosition();
  }

  function triggerDeath() {
    isDead = true;
    deathFrame = 0;
  }

  function revive() {
    isDead = false;
    deathFrame = 0;
    setSprite("idle", 0);
  }

  function handleIdleState() {
    idleTimer += 1;
    const sprite = sprites.idle || sprites.run;
    if (sprite) {
      const slowFrame = Math.floor(idleTimer / idleFrameDivider);
      const spriteName = sprites.idle ? "idle" : "run";
      setSprite(spriteName, slowFrame);
    }

    const elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
    if (!isDead && elapsedSeconds >= lastDeathTrigger + deathIntervalSeconds) {
      lastDeathTrigger = elapsedSeconds;
      triggerDeath();
    }
  }

  function handleAttackState() {
    const sprite = sprites.attack || sprites.run || sprites.idle;
    if (!sprite) return;
    const frameDuration = attackFrameDuration;
    const targetName =
      sprite === sprites.attack
        ? "attack"
        : sprite === sprites.run
        ? "run"
        : "idle";
    setSprite(targetName, Math.floor(attackFrame / frameDuration));
    attackFrame += 1;
    if (Math.floor(attackFrame / frameDuration) >= sprite.frames) {
      isAttacking = false;
      attackFrame = 0;
      setSprite("idle", 0);
    }
  }

  function handleDeathState() {
    const sprite = sprites.dead || sprites.idle || sprites.run;
    if (!sprite) return;
    const frameDuration = deathFrameDuration;
    const targetName =
      sprite === sprites.dead
        ? "dead"
        : sprite === sprites.run
        ? "run"
        : "idle";
    setSprite(
      targetName,
      Math.min(sprite.frames - 1, Math.floor(deathFrame / frameDuration))
    );
    deathFrame += 1;
    if (deathFrame >= deathDurationFrames) {
      revive();
    }
  }

  let lastFrameTimestamp;
  const startTimestamp = Date.now();

  function onAnimationFrame(timestamp) {
    if (!companionEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp >= 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function frame() {
    frameCount += 1;

    if (isAttacking) {
      handleAttackState();
      return;
    }

    if (isDead) {
      handleDeathState();
      return;
    }

    const diffX = companionPosX - mousePosX;
    const diffY = companionPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < speed || distance < idleDistance) {
      handleIdleState();
      return;
    }

    idleTimer = 0;

    if (diffX > 1) {
      facingLeft = true;
    } else if (diffX < -1) {
      facingLeft = false;
    }

    if (sprites.run) {
      setSprite("run", Math.floor(frameCount / runFrameDivider));
    } else {
      setSprite("idle", Math.floor(frameCount / runFrameDivider));
    }

    companionPosX -= (diffX / distance) * speed;
    companionPosY -= (diffY / distance) * speed;

    const width = currentSpriteMeta
      ? currentSpriteMeta.renderWidth
      : displayHeight;
    const height = currentSpriteMeta
      ? currentSpriteMeta.renderHeight
      : displayHeight;

    companionPosX = Math.min(
      Math.max(width / 2, companionPosX),
      window.innerWidth - width / 2
    );
    companionPosY = Math.min(
      Math.max(height / 2, companionPosY),
      window.innerHeight - height / 2
    );

    updateElementPosition();
  }

  function init() {
    companionEl.id = `follower-${variantKey}`;
    companionEl.ariaHidden = true;
    companionEl.style.position = "fixed";
    companionEl.style.pointerEvents = "auto";
    companionEl.style.imageRendering = "pixelated";
    companionEl.style.zIndex = 2147483647;
    companionEl.style.backgroundRepeat = "no-repeat";
    companionEl.style.cursor = "pointer";
    companionEl.style.transformOrigin = "center";

    restoreState();
    document.body.appendChild(companionEl);

    setSprite("idle", 0);

    document.addEventListener("mousemove", (event) => {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    companionEl.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!isDead && !isAttacking) {
        isAttacking = true;
        attackFrame = 0;
      }
    });

    window.addEventListener("beforeunload", persistState);

    window.requestAnimationFrame(onAnimationFrame);
  }

  loadSprites().then(() => {
    if (!Object.keys(sprites).length) {
      console.warn(
        `[follower-variants] No sprites loaded for variant ${variantKey}`
      );
      return;
    }
    init();
  });
})();
