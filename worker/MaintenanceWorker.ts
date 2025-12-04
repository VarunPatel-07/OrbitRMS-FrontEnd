/* eslint-disable @typescript-eslint/no-explicit-any */
interface WorkerRequest {
  url: string;
  token: string;
}

let timeIntervalId: ReturnType<typeof setTimeout> | null = null;

self.onmessage = function (e: MessageEvent<WorkerRequest>) {
  const { url, token } = e.data;

  if (timeIntervalId) {
    clearInterval(timeIntervalId);
  }

  WorkerApiFetchFunction(url, token);

  timeIntervalId = setInterval(
    () => {
      WorkerApiFetchFunction(url, token);
    },
    5 * 60 * 1000
  );
};

function WorkerApiFetchFunction(url: string, token: string) {
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const responseBody = await res.json().catch(() => null);

        const err = new Error(`HTTP error! status: ${res.status}`);

        (err as any).status = res.status;
        (err as any).data = responseBody?.detail?.data;
        throw err;
      }
      return res.json();
    })
    .then((data) => {
      self.postMessage({ success: true, data });
    })
    .catch((err: any) => {
      self.postMessage({
        success: false,
        error: {
          message: err.message,
          stack: err.stack,
          status: err.status,
          data: err?.data ? err.data : null,
        },
        data: null,
      });
    });
}
