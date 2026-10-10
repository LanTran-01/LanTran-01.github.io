import { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useExplorerStore } from "@/state/explorerStore";
import { MaterialController } from "@/features/gundam/materialController";
import { deriveVisualInputs, visualInputsKey } from "@/features/component-inspection/modeVisuals";
import type { ViewerModelIndex } from "@/features/gundam/annotateModel";
import { useModelInteraction } from "./useModelInteraction";
import { SubassemblyCalloutTracker } from "./SubassemblyCallouts";

/**
 * Puts the indexed model in the scene, drives mode visuals (per-mesh cloned
 * materials, damped every frame) and wires pointer interaction.
 */
export function ModelRenderer({ model }: { model: ViewerModelIndex }) {
  const invalidate = useThree((s) => s.invalidate);
  const [controller, setController] = useState<MaterialController | null>(null);

  useEffect(() => {
    const ctrl = new MaterialController(model);
    let lastKey = "";
    const sync = () => {
      const inputs = deriveVisualInputs(useExplorerStore.getState());
      const key = visualInputsKey(inputs);
      if (key === lastKey) return;
      lastKey = key;
      ctrl.apply(inputs);
      invalidate();
    };
    sync();
    // First paint after a (re)mount should not animate from defaults.
    ctrl.update(0, true);
    setController(ctrl);
    const unsub = useExplorerStore.subscribe(sync);
    return () => {
      unsub();
      ctrl.dispose();
      setController(null);
    };
  }, [model, invalidate]);

  useFrame((_, dt) => {
    if (!controller) return;
    const instant = useExplorerStore.getState().reducedMotion;
    if (controller.update(dt, instant)) invalidate();
  });

  useModelInteraction(controller);

  return (
    <>
      <primitive object={model.root} />
      {controller && <SubassemblyCalloutTracker model={model} />}
    </>
  );
}
