class world {
  constructor() {
    this.canvas = goap_game;
    this.context = this.canvas.getContext("2d");
  }
}
// const create_world = new world();

const world_state = {
  player_visible: false,
  isPlayerInRange: false,
  low_health: true,
  has_health_pack: false,
  at_last_known_pos: false,
  player_alive: true,
};

class Actions {
  constructor(action_name, pre_requisites, effect, cost) {
    ((this.action_name = action_name),
      (this.pre_requisites = pre_requisites),
      (this.effect = effect),
      (this.cost = cost));
  }
}

const All_actions = [
  new Actions(
    "Patrol",
    { player_visible: false },
    { at_last_known_pos: false },
    1,
  ),

  new Actions(
    "Chase",
    { player_visible: true, isPlayerInRange: false },
    { isPlayerInRange: true },
    2,
  ),

  new Actions("Attack", { isPlayerInRange: true }, { player_alive: false }, 2),

  new Actions(
    "FindHealth",
    { has_health_pack: false },
    { has_health_pack: true },
    1,
  ),

  new Actions(
    "UseMed",
    { low_health: true, has_health_pack: true },
    { low_health: false, has_health_pack: false },
    2,
  ),

  new Actions(
    "Search",
    { player_visible: false },
    { at_last_known_pos: true },
    1,
  ),
];

let All_actions_by_effect = {};
function hashmap_effect() {
  for (const action of All_actions) {
    for (const effect in action.effect) {
      const effectKey = `${effect}:${action.effect[effect]}`;
      if (!All_actions_by_effect[effectKey]) {
        All_actions_by_effect[effectKey] = [];
      }
      All_actions_by_effect[effectKey].push(action);
    }
  }
  return All_actions_by_effect;
}
All_actions_by_effect = hashmap_effect();

class goal {
  constructor(goalName, priority, desire_state) {
    this.goalName = goalName;
    this.priority = priority;
    this.desire_state = desire_state;
  }
}

const All_goals = [
  new goal("EliminatePlayer", 1, { player_alive: false }),

  new goal("StayHealthy", 2, { low_health: false }),

  new goal("InvestigateArea", 3, { at_last_known_pos: true }),
];

class Planner {
  constructor(goal, actions) {
    this.goal = goal;
    this.actions = actions;
    this.Available_action = [];
    this.Available_action_by_effect = {};
  }

  //desired state should be Object here {"state name":--}
  #get_desired_state(desired_state, ws) {
    let satisfied = true;

    for (const key in desired_state) {
      if (ws[key] !== desired_state[key]) {
        satisfied = false;
        break;
      }
    }

    if (satisfied) {
      return [];
    }

    for (const key in desired_state) {
      // let plans=[]
      const effectKey = `${key}:${desired_state[key]}`;
      const possibleActions = All_actions_by_effect[effectKey] || [];

      for (const action of possibleActions) {
        const subPlans = this.#get_desired_state(action.pre_requisites, ws);
        if (subPlans !== null) {
          // plans.push(action)
          return [...subPlans, action];
        }
      }
    }
    return null;
    // return sub
  }

  build_plan(world_state, All_goals) {
    // getting best goal-------------
    const plans = {};
    for (const goal of All_goals) {
      let ws = world_state;
      let plan = this.#get_desired_state(goal.desire_state, ws);

      if (!plans[goal.goalName]) {
        plans[goal.goalName] = [];
      }
      plans[goal.goalName] = plan;
    }
    console.log(plans);

    return plans;
  }
}

const planner = new Planner(All_goals, All_actions);
// planner.check_available_action();
planner.build_plan(world_state, All_goals)

class trooper {
  constructor(world) {
    this.health = 100;
    this.inventory = {};
    this.world = world;
  }

  hurt() {
    this.health--;
  }

  draw_trooper() {}
  add_to_inventory(item) {
    this.inventory = (this.inventory[item] || 0) + 1;
  }
}
