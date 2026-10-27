import type { Object3D } from "three";
import { onBoard, stackBoard, PCB_T } from "./boards";
import { EX, STACK, y } from "./layout";
import type { Kit, V3 } from "./primitives";

/** Gap between the board edges and the rails, where cables run up the side of the stack. */
const CABLE_X = 0.625;

function buildObc(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "obc");
  const yb = y(STACK.obc);
  const top = yb + PCB_T / 2;
  const ex = EX.obc;
  stackBoard(kit, P, "obc", yb, "obc-board", ex);
  onBoard(kit, P, "proc.package", "obc-proc", [0.3, 0.03, 0.3], [0.02, -0.02], top, ex);
  onBoard(kit, P, "proc.lid", "obc-proc", [0.2, 0.012, 0.2], [0.02, -0.02], top + 0.03, ex, m.aluminum);
  for (const [i, x] of [-0.26, 0.02, 0.3].entries()) {
    onBoard(kit, P, `mem.${i}`, "obc-mem", [0.2, 0.022, 0.1], [x, 0.36], top, ex);
  }
  onBoard(kit, P, "sup", "obc-sup", [0.08, 0.02, 0.08], [0.3, -0.34], top, ex);
  for (const z of [-0.2, 0.2]) {
    onBoard(kit, P, `io.body${z > 0 ? "a" : "b"}`, "obc-io", [0.07, 0.07, 0.26], [0.5, z], top, ex);
    onBoard(kit, P, `io.pins${z > 0 ? "a" : "b"}`, "obc-io", [0.02, 0.012, 0.22], [0.5, z], top + 0.07, ex, m.gold);
  }
}

function buildImu(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "imu");
  const yb = y(STACK.imu);
  const top = yb + PCB_T / 2;
  const ex = EX.imu;
  stackBoard(kit, P, "imu", yb, "imu-board", ex);
  onBoard(kit, P, "housing.base", "imu-housing", [0.48, 0.035, 0.48], [0.05, 0], top, ex, m.shield);
  const baseTop = top + 0.035;
  onBoard(kit, P, "gyro", "imu-gyro", [0.16, 0.09, 0.16], [-0.03, -0.06], baseTop, ex);
  onBoard(kit, P, "accel", "imu-accel", [0.11, 0.025, 0.11], [0.17, 0.1], baseTop, ex);
  // The lid is a separate part so the exploded view can lift it off the sensors.
  onBoard(kit, P, "housing.lid", "imu-housing", [0.48, 0.11, 0.48], [0.05, 0], baseTop, EX.imuLid, m.shield);
  onBoard(kit, P, "conn", "imu-board", [0.24, 0.05, 0.07], [0.05, -0.38], top, ex);
}

function buildGnssBoard(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "gnss");
  const yb = y(STACK.gnss);
  const top = yb + PCB_T / 2;
  const ex = EX.gnss;
  stackBoard(kit, P, "gnss", yb, "gnss-board", ex);
  onBoard(kit, P, "rf.can", "gnss-rf", [0.34, 0.07, 0.28], [0.15, 0.12], top, ex, m.shield);
  onBoard(kit, P, "proc", "gnss-proc", [0.2, 0.025, 0.2], [-0.2, -0.16], top, ex);
  onBoard(kit, P, "tcxo", "gnss-proc", [0.07, 0.02, 0.05], [0.05, -0.3], top, ex, m.shield);
  onBoard(kit, P, "rf.conn", "gnss-cable", [0.05, 0.04, 0.05], [0.42, 0.3], top, ex, m.gold);
  // Antenna cable: up the side gap between the boards and the rails to the patch on top.
  const run: V3[] = [
    [0.42, top + 0.03, 0.3],
    [CABLE_X, top + 0.06, 0.3],
    [CABLE_X, y(STACK.topFrame - 0.12), 0.3],
    [0.32, y(STACK.topFrame + 0.02), 0.18],
    [0.05, y(STACK.deployer - 0.04), 0.05],
  ];
  P("cable", kit.tube(run, 0.014, 40, 6), m.cable, "internal", "gnss-cable", { ex });
}

function buildComms(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "comms");
  const yb = y(STACK.comms);
  const top = yb + PCB_T / 2;
  const ex = EX.comms;
  stackBoard(kit, P, "comms", yb, "com-board", ex);
  onBoard(kit, P, "trx.can", "com-trx", [0.42, 0.075, 0.34], [-0.08, -0.12], top, ex, m.shield);
  onBoard(kit, P, "trx.osc", "com-trx", [0.08, 0.02, 0.06], [-0.32, 0.3], top, ex);
  onBoard(kit, P, "pa.can", "com-pa", [0.24, 0.065, 0.2], [0.24, 0.22], top, ex, m.shield);
  onBoard(kit, P, "pa.spreader", "com-pa", [0.3, 0.012, 0.26], [0.24, 0.22], top + 0.065, ex, m.aluminum);
  onBoard(kit, P, "rf.conn", "com-rf", [0.06, 0.06, 0.06], [0.48, -0.3], top, ex, m.gold);
  const run: V3[] = [
    [0.48, top + 0.04, -0.3],
    [CABLE_X, top + 0.07, -0.3],
    [CABLE_X, y(STACK.topFrame - 0.1), -0.3],
    [0.34, y(STACK.topFrame + 0.02), -0.22],
    [0.12, y(STACK.deployer - 0.04), -0.08],
  ];
  P("rf.cable", kit.tube(run, 0.016, 32, 6), m.cable, "internal", "com-rf", { ex });
}

export function buildAvionics(kit: Kit, root: Object3D) {
  buildObc(kit, root);
  buildImu(kit, root);
  buildGnssBoard(kit, root);
  buildComms(kit, root);
}
