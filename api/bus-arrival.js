/**
 * LTA DataMall v3 Bus Arrival API Proxy
 * GET /api/bus-arrival?BusStopCode=04121&ServiceNo=7
 *
 * Parameters:
 * - BusStopCode: (Required) 5-digit bus stop identifier (e.g. 04121, 09023)
 * - ServiceNo: (Optional) Specific bus line number to filter by (e.g. 7, 65)
 *
 * Header:
 * - AccountKey: Provided via process.env.LTA_ACCOUNT_KEY
 */

export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Cache control: LTA DataMall refreshes every 20 seconds
  res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract query parameters (supporting both case variants)
  const busStopCode = req.query.BusStopCode || req.query.busStopCode;
  const serviceNo = req.query.ServiceNo || req.query.serviceNo;

  if (!busStopCode) {
    return res.status(400).json({
      error: 'Missing required parameter: BusStopCode',
      usage: 'GET /api/bus-arrival?BusStopCode=04121[&ServiceNo=7]'
    });
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY;

  // Build LTA DataMall v3 URL
  let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
  if (serviceNo) {
    ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }

  // If no AccountKey is set in environment, return graceful mock/fallback with notice
  if (!accountKey) {
    return res.status(200).json({
      odata_metadata: 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrival',
      BusStopCode: busStopCode,
      source: 'simulated_fallback',
      warning: 'LTA_ACCOUNT_KEY is not configured yet in environment variables. Returning simulated transit arrival data.',
      Services: [
        {
          ServiceNo: serviceNo || '65',
          Operator: 'SBST',
          NextBus: {
            OriginCode: '84009',
            DestinationCode: '14009',
            EstimatedArrival: new Date(Date.now() + 60 * 1000).toISOString(),
            Latitude: '1.3045',
            Longitude: '103.8320',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD'
          },
          NextBus2: {
            OriginCode: '84009',
            DestinationCode: '14009',
            EstimatedArrival: new Date(Date.now() + 6 * 60 * 1000).toISOString(),
            Latitude: '1.3120',
            Longitude: '103.8450',
            VisitNumber: '1',
            Load: 'SDA',
            Feature: 'WAB',
            Type: 'DD'
          },
          NextBus3: {
            OriginCode: '84009',
            DestinationCode: '14009',
            EstimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            Latitude: '1.3250',
            Longitude: '103.8610',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'SD'
          }
        },
        ...(serviceNo ? [] : [
          {
            ServiceNo: '147',
            Operator: 'SBST',
            NextBus: {
              OriginCode: '64009',
              DestinationCode: '28009',
              EstimatedArrival: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
              Latitude: '1.3010',
              Longitude: '103.8350',
              VisitNumber: '1',
              Load: 'SDA',
              Feature: 'WAB',
              Type: 'DD'
            },
            NextBus2: {
              OriginCode: '64009',
              DestinationCode: '28009',
              EstimatedArrival: new Date(Date.now() + 9 * 60 * 1000).toISOString(),
              Latitude: '1.3100',
              Longitude: '103.8420',
              VisitNumber: '1',
              Load: 'SEA',
              Feature: 'WAB',
              Type: 'DD'
            }
          },
          {
            ServiceNo: '7',
            Operator: 'SBST',
            NextBus: {
              OriginCode: '84009',
              DestinationCode: '43009',
              EstimatedArrival: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
              Latitude: '1.2980',
              Longitude: '103.8490',
              VisitNumber: '1',
              Load: 'SEA',
              Feature: 'WAB',
              Type: 'DD'
            },
            NextBus2: {
              OriginCode: '84009',
              DestinationCode: '43009',
              EstimatedArrival: new Date(Date.now() + 14 * 60 * 1000).toISOString(),
              Latitude: '1.3090',
              Longitude: '103.8620',
              VisitNumber: '1',
              Load: 'SEA',
              Feature: 'WAB',
              Type: 'SD'
            }
          }
        ])
      ]
    });
  }

  try {
    const response = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API responded with HTTP ${response.status}`,
        details: errorText,
        BusStopCode: busStopCode
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to communicate with LTA DataMall',
      message: error instanceof Error ? error.message : String(error),
      BusStopCode: busStopCode
    });
  }
}
