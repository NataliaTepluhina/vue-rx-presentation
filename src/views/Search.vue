<template>
    <v-layout>
        <v-flex xs12>
            <v-text-field label="Who are you looking for?" v-stream:keyup.native="userInput$" />
            <v-list class="heroes-list" v-if="filteredNames.length">
                <template v-for="(hero, index) in filteredNames">
                    <v-list-tile @click="{}" :key="index">
                        <v-list-tile-content>{{hero}}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider/>
                </template>
            </v-list>
            <v-subheader v-else>No results found</v-subheader>
        </v-flex>
    </v-layout>
</template>

<script>
    import {map, debounceTime, distinctUntilChanged, startWith} from 'rxjs/operators'

    export default {
        data() {
            return {
                heroes: [
                    'Evan You',
                    'Edd Yerburgh',
                    'Sarah Drasner',
                    'Jen Looper',
                    'Sebastien Chopin',
                    'Alexandre Chopin',
                    'Guillaume Chau',
                    'Alex Kyriakidis',
                    'Blake Newman',
                    'Eduardo San Martin Morote',
                    'Chris Fritz',
                    'John Leider'
                ],
            }
        },
        domStreams: ['userInput$'],
        subscriptions() {
            return {
                filteredNames: this.userInput$
                    .pipe(
                        map(event => event.event.target.value),
                        debounceTime(500),
                        startWith(''),
                        distinctUntilChanged(),
                        map(value => {
                            const pattern = new RegExp(value, 'i');
                            return this.heroes.filter(el => el.match(pattern))
                        })
                  )
            }
        },
    }
</script>

<style scoped>
    .heroes-list {
        width: 100%;
    }
</style>