import EventSaga from "event-saga";
import samsara from "samsara-lib";

export default function followSpiritLogSaga(eventBus) {
  return new EventSaga(eventBus, (saga) => {
    saga.createOn("followSpiritLifeLog", async function (data) {
      const logs = await samsara()
        .spirit(data.name)
        .life(data.life)
        .containerLog(true, {
          stdout: true,
          stderr: true,
          follow: true,
          tail: 50,
        });
      logs.on("data", function (chunk) {
        eventBus.emit("spiritLifeLogChunk", {
          target: data.target,
          data: chunk.toString("utf8"),
        });
      });
      this.data.logs = logs;
    });

    saga.on("unfollowSpiritLifeLog", function () {
      this.data.logs.unpipe();
      this.done();
    });
  });
}
