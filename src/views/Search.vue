<template>
    <v-layout>
        <v-flex xs12>
            <v-text-field label="Who are you looking for?" v-stream:keyup.native="userInput$"/>
            <v-list class="heroes-list" v-if="filteredNames.length">
                <template v-for="(hero, index) in searchResults">
                    <v-list-tile @click="{}" :key="index">
                        <v-list-tile-content>{{hero.name}}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider/>
                </template>
            </v-list>
            <v-subheader v-else>No results found</v-subheader>
            <div v-if="search">{{search}}</div>
        </v-flex>
    </v-layout>
</template>

<script>
    import {debounceTime, distinctUntilChanged, map, startWith} from 'rxjs/operators'
    import vuers from '../data/vuers'

    export default {
        data() {
            return {
                vuers
            }
        },
        computed: {
            filtered() {
                return this.userInput$
                    .pipe(
                        map(input => input.event.target.value),
                        debounceTime(500),
                        startWith(''),
                        distinctUntilChanged(),
                        map(value => {
                            const pattern = new RegExp(value, 'i');
                            return this.vuers.filter(el => el.name.match(pattern))
                        })
                    )
            }
        },
        domStreams: ['userInput$'],
        subscriptions() {
            return {
                filteredNames: this.filtered,
                searchResults: this.filtered.pipe(
                    map(names => names.reverse())
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