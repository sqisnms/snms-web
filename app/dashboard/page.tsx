// import { auth } from '@/auth';

export default function Page() {
  // const session = await auth(); // 세션처리 추후 개발

  return (
    <div>
      <h1>Grafana Dashboard</h1>
      <iframe
        title="서버자원 모니터링"
        // src="api/grafana2/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk&from=now-24h&to=now&theme=light&refresh=5s"
        src="http://ktoss.iptime.org:53000/d/ae0ijnes4j7cwe/server-resource?orgId=1&kiosk&from=now-24h&to=now&theme=light&refresh=5s"
        width="100%"
        height="600"
        frameBorder="0"
      />
    </div>
  )
}
