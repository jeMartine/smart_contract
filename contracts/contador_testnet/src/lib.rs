#![no_std]
use soroban_sdk::{Env, Symbol, contract, contractimpl, contracttype, symbol_short};
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct State {
    pub count: u32,
    pub last_incr: u32,
}

const STATE: Symbol = symbol_short!("STATE");

#[contract]
pub struct IncrementContract;

#[contractimpl]
impl IncrementContract {
    //La función recibe el valor que se va a sumar
    pub fn increment(env: Env, incr: u32) -> u32 {
        // Obtner la estructura actual
        let mut state = Self::get_state(env.clone());

        // aumentar
        state.count += incr;
        state.last_incr = incr;

        // Guardar la estructura
        env.storage().instance().set(&STATE, &state);

        // Retornar la estructura
        state.count
    }
    /// Permite obtener la estructura actual almacenada 
    pub fn get_state(env: Env) -> State {
        env.storage().instance().get(&STATE).unwrap_or(State {
            count: 0,
            last_incr: 0,
        }) // If no value set, assume 0.
    }
}

mod test;
