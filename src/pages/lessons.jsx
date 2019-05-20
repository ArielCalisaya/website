import React from "react";
import { SmallJumbotron } from "../components/smalljumbo.jsx";
import { Filter, Loading } from "@breathecode/ui-components";
import { Context } from "../store/appContext.jsx";
import Store from "../store/appContext.jsx";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";
import "@breathecode/ui-components/dist/main.css";
import Layout from "../components/layout"


export class Lessons extends React.Component {
	constructor() {
		super();
		this.state = {
            selectedLanguages:[],
			selectedTags: [],
			selectedAuthors: []
		};
	}

	filterByLang = l => {
		if (this.state.selectedLanguages.length == 0) return true;
		for (let i = 0; i < this.state.selectedLanguages.length; i++) {
			if (l.lang.includes(this.state.selectedLanguages[i].value)) return true;
		}
		return false;
	}
    filterByTags = l => {
		if (this.state.selectedTags.length == 0) return true;
		for (let i = 0; i < this.state.selectedTags.length; i++) {
			if (l.tags.includes(this.state.selectedTags[i].value)) return true;
		}
		return false;
	}
	filterByAuthors = l => {
		if (this.state.selectedAuthors.length == 0) return true;
		for (let i = 0; i < this.state.selectedAuthors.length; i++) {
			if (l.authors == null) {
				return false;
			}
			if (l.authors.includes(this.state.selectedAuthors[i].value)) return true;
		}
		return false;
	};
    replaceDraft = lessonLink =>{
            if (lessonLink.includes("[draft]")&&lessonLink.includes("en")){
                let newLink = lessonLink.replace("[draft]","");
                return newLink;
            }
            else{
                return lessonLink
            }
    };

	render() {
		return (

            <Layout>
			<Navbar/>


				<Context.Consumer>
					{({ store, actions }) => {
                        console.log(store.lessonLanguage)
						return (
							<div>

								<SmallJumbotron
									jumboClass="jumbotron jumbotron-fluid mb-0 bg-white"
									containerClass="pl-4  container"
									headerClass="display-4 font-weight-bold  text-left"
									headerText="Lessons Published"
									pClass="lead  text-left"
									pContent="the following lessons explain different programing
										concepts and have been published by breathe code
										members, search for a partiulars lesson using the
										filters bellow"
                                    spanClass="h3 text-secondary"
                                    spanContent="md"
								/>
								<div className="row sticky-top bg-white border-top border-bottom">
									<div className="container">
										<div className="row">
											<div className="col-12  d-flex justify-content-start ">
												<div className="px-1 py-2">
													<Filter
														label="Tags"
														placeholder="Filter by topic"
														onChange={d =>
															this.setState({
																selectedTags: d
															})
														}
															options={store.tags?actions.filterRepeated(store.tags).map((tag, index) => {
															return {
																label: tag,
																value: tag
															};
														}):<Loading/>}

													/>
												</div>
                                                <div className="px-1 py-2">
													<Filter
														label="Language"
														placeholder="Filter by language"
														onChange={d =>
															this.setState({
																selectedLanguages: d
															})
														}
															options={store.lessonLanguage?actions.filterRepeated(store.lessonLanguage).map((lan, index) => {
															return {
																label: lan,
																value: lan
															};
														}):[{
																label: <Loading/>,
																value: <Loading/>
															}]}

													/>
												</div>
												<div className="px-1 pl-1 py-2">
													<Filter
														label="Author"
														placeholder="Filter by author"
														onChange={d =>
															this.setState({
																selectedAuthors: d
															})
														}
														options={actions.filterRepeated(store.authors).map(author => {
															return {
																label: author,
																value: author
															};
														})}
														withToggler={false}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								{store.lessons == null ? <Loading /> : store.lessons
                                    .filter(this.filterByLang)
									.filter(this.filterByAuthors)
									.filter(this.filterByTags)
									.map((lesson, index) => {
										return (
											<div className="container" key={index}>
												<div className="row">
													<div className="col-12  py-2">
														<div className="pl-3">
															<a
																target="_blank"
																className="h2 text-dark btn-default"
																href={actions.lessonUrl(lesson)}>
																{lesson.title}
															</a>
															<div className={`row ${!lesson.authors&&"mb-2"}`}>
																{lesson.authors&&<div className="col py-2 text-dark">
																	{lesson.authors && "Contributors: "}
																	{lesson.authors && lesson.authors.map((a,k) => (<a
																		href={`https://github.com/${a}`}
																		target="_blank"
																		key={k}
																		className="author badge badge-pill badge-light mr-2">@{a}</a>))}
																</div>}
															</div>
															<p className="lead text-dark ">{lesson.subtitle}</p>
															<div className="row ">
                                                                <div className="col pl-1">
																{lesson.tags.map((tag, index) => {
																	return (
																		<div
																			key={index}
																			className="author badge badge-pill badge-light mr-2">
																			{tag}
																		</div>
																	);
																})}
                                                                </div>
                                                                <a href={this.replaceDraft(actions.lessonUrl(lesson))}  className="btn btn-outline-primary ml-auto mr-3">Read lesson</a>
															</div>
														</div>
													</div>
												</div>
												<hr className="my-4 " />
											</div>
										);
									})}
							</div>
						);
					}}
				</Context.Consumer>
				<Footer/>
            </Layout>

		);
	}
}

export default Store(Lessons)