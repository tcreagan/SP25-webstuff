import { randomInt, randomUUID } from "crypto"
import { Models, dbConnector } from "../../db/initConnection"

const eventTypeData = [
  {name: "Login"},
  {name: "Logout"},
  {name: "Error"},
]

const userData = [
  {
    email: "foo@bar.net",
    password_hash: randomUUID()
  },
  {
    email: "bob@ross.com",
    password_hash: randomUUID()
  },
  {
    email: "lorem@gmail.com",
    password_hash: randomUUID()
  }
]

const projectData = [
  {
    project_name: "MyfirstProject"
  },
  {
    project_name: "My Site"
  },
  {
    project_name: "Lorem Ipsum"
  },
  {
    project_name: "Foo bar baz"
  }
]

const pageData = [
  {
    project_id: 1,
    content: "Page content!"
  }
]


//console.log(Models)
async function main() {
  let eventTypes = eventTypeData.map(data => {
    return Models.EventType.create(data)
  })

  await new Promise<void>(async resolve => {
    for (let i = 0; i < eventTypes.length; i++) {
      await eventTypes[i].save()

    }
    resolve()
  })

  let events: any[] = []

  for (let i = 0; i < 5; i++) {
    events.push(Models.Event.create({
      occurred_time: new Date(),
      event_log: randomUUID(),
      event_type_id: eventTypes[randomInt(eventTypes.length)].id
    }))
  }

  await new Promise<void>(async resolve => {
    for (let id = 0; id < events.length; id++) {
      const element = events[id];
      await element.save()
    }
    resolve();
  });

  const foo = Models.Event.create({})
  type t = typeof foo
  console.log((events[0] as t).type)

  dbConnector.close()
}


main()