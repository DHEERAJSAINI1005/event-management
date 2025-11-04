import { Client } from "@elastic/elasticsearch";

const ELASTIC_URL = process.env.ELASTIC_URL || "http://localhost:9200";

export const esClient = new Client({ node: ELASTIC_URL });

export const indexEvent = async (event) => {
  try {
    await esClient.index({
      index: "events",
      id: event._id.toString(),
      body: {
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        durationHours: event.durationHours,
        slug: event.slug,
      },
    });
    await esClient.indices.refresh({ index: "events" });
  } catch (err) {
    console.error("Elastic index error:", err);
  }
};

export const deleteEventFromIndex = async (id) => {
  try {
    await esClient.delete({ index: "events", id });
  } catch (err) {
  }
};
